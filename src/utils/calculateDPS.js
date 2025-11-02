// ================== DPS 계산 유틸 (시간대별 분석 추가) ==================

// DPS 계산의 기준 시뮬레이션 시간 (초) 배열
export const SIM_TIMES = [30, 40, 60];
const DEFAULT_SIM_TIME = 60; // 최적 조합 탐색 및 기본 DPS 표시 기준

// % 입력을 안전하게 숫자로
const P = (v) => Number(v || 0);

// ---- 1) comment 파서 (T_sim 인자 추가) --------------------------------
/**
 * 주석을 파싱하여 특정 시뮬레이션 시간(T_sim) 기준으로 DPS 기여도를 추출합니다.
 */
function parseComment(comment = "", T_sim) {
  const text = String(comment);

  // 쿨타임은 코멘트 전체에서 한 번만 찾아서 모든 스킬/버프에 적용
  const cdMatch = text.match(/쿨타임\s*(\d+(\.\d+)?)\s*초/);
  const cooldown = cdMatch ? Number(cdMatch[1]) : T_sim;

  let totalSkillPercentPerSec = 0;
  let totalBuffRatio = 0;
  let buffUptimeRatio = 0;

  const activations = Math.floor(T_sim / cooldown);

  // 1. 스킬 피해 파싱
  const skillPattern = /(\d+)\s*%\s*피해\s*(\d+)\s*회/g;
  let m;
  while ((m = skillPattern.exec(text)) !== null) {
    const damagePct = Number(m[1]);
    const hits = Number(m[2]);
    const totalDamage = damagePct * hits * activations;
    totalSkillPercentPerSec += totalDamage / T_sim;
  }

  // 2. 공격력 증폭 버프 파싱 (정규식 수정)
  const attackBuffPattern = /공격력\s*(?:증폭)?\s*(\d+)\s*초(?:동안)?\s*(\d+)\s*%/g;
  let b;
  while ((b = attackBuffPattern.exec(text)) !== null) {
    const buffDur = Number(b[1]);
    const buffPct = Number(b[2]);
    
    const totalUptime = Math.min(buffDur, T_sim) * activations;
    const finalUptimeRatio = Math.min(totalUptime / T_sim, 1);
    
    totalBuffRatio += (buffPct / 100) * finalUptimeRatio;
    buffUptimeRatio = Math.min(buffUptimeRatio + finalUptimeRatio, 1);
  }
  
  // 다른 종류의 버프들도 위와 같이 명확한 정규식으로 추가 가능

  return {
    skillPctPerSec: totalSkillPercentPerSec,
    baseBuffRatio: totalBuffRatio,
    buffUptimeRatio: buffUptimeRatio * 100,
    cooldown,
  };
}

// ---- 2) 개별 정령 DPS (특정 시간 기준) --------------------------------
/**
 * 단일 정령의 DPS를 특정 시간(T_sim) 기준으로 계산하는 내부 함수.
 */
function calcSpiritDPSForTime(spirit, buffs, sameTypeBuff = 0, T_sim) {
  if (!spirit) return { dps: 0, breakdown: { base: 0, skillDPS: 0, buffDPS: 0, buffUptime: 0 } };

  const speedBase = P(spirit.character_attack_speed);
  const coef = P(spirit.character_attack_coef);
  const element = spirit.element_type || null;

  const spiritAmp = P(buffs.spiritAttackAmplify);
  const finalAtkPct = P(buffs.finalAttack);
  const speedPctFromTeam = P(buffs.characterAttackSpeed);

  const typeAmpMap = {
    FIRE: P(buffs.fireAmplify), WATER: P(buffs.waterAmplify), GRASS: P(buffs.grassAmplify),
    LIGHT: P(buffs.lightAmplify), DARK: P(buffs.darkAmplify),
  };
  const typeAmp = element ? typeAmpMap[element] || 0 : 0;

  let uniqueTypeBuff = 0;
  if (spirit.buff_target_type?.startsWith('character_')) {
    uniqueTypeBuff = P(spirit.buff_value);
  }

  const { skillPctPerSec, baseBuffRatio, buffUptimeRatio } = parseComment(spirit.comment, T_sim);

  const speed = speedBase * (1 + speedPctFromTeam / 100);
  const base = speed * (coef + (spiritAmp + typeAmp + uniqueTypeBuff + P(sameTypeBuff)) / 100) * (1 + finalAtkPct / 100);
  const skillDPS = coef * (skillPctPerSec / 100);
  const buffDPS = base * baseBuffRatio;
  const dps = base + skillDPS + buffDPS;

  return {
    dps,
    breakdown: { base, skillDPS, buffDPS, buffUptime: buffUptimeRatio },
  };
}

// ---- 3) 개별 정령 DPS (모든 시간대) -----------------------------------
/**
 * 모든 시뮬레이션 시간대에 대한 DPS 결과를 계산하여 반환합니다.
 */
export function calcSpiritDPS(spirit, buffs, sameTypeBuff = 0) {
  const timeResults = {};
  SIM_TIMES.forEach(T_sim => {
    timeResults[T_sim] = calcSpiritDPSForTime(spirit, buffs, sameTypeBuff, T_sim);
  });

  return {
    // 60초 기준 값을 기본값으로 제공
    dps: timeResults[DEFAULT_SIM_TIME].dps,
    breakdown: timeResults[DEFAULT_SIM_TIME].breakdown,
    timeResults, // 모든 시간대 결과 포함
  };
}

// ---- 4) 팀 DPS (모든 시간대) -----------------------------------------
/**
 * 팀 전체의 DPS를 모든 시뮬레이션 시간대별로 계산하여 반환합니다.
 */
export function calcTeamDPS(selectedSpirits, buffs) {
  const teamDPSByTime = {};
  SIM_TIMES.forEach(t => teamDPSByTime[t] = 0);

  if (!Array.isArray(selectedSpirits) || selectedSpirits.length === 0) {
    return teamDPSByTime;
  }

  const shared = { FIRE: 0, WATER: 0, GRASS: 0, LIGHT: 0, DARK: 0 };
  const team = { character_attack: 0, character_attack_speed: 0, character_defense: 0, character_hp: 0 };

  selectedSpirits.forEach((s) => {
    if (!s || !s.buff_target_type) return;
    if (s.buff_target_type.startsWith('element_')) {
      const el = s.buff_target_type.split('_')[1]?.toUpperCase();
      if (el && shared[el] != null) shared[el] += P(s.buff_value);
    }
    if (s.buff_target_type.startsWith('character_')) {
      const key = s.buff_target_type;
      if (team[key] != null) team[key] += P(s.buff_value);
    }
  });

  const combinedBuffs = {
    ...buffs,
    spiritAttackAmplify: P(buffs.spiritAttackAmplify) + team.character_attack,
    characterAttackSpeed: team.character_attack_speed,
  };

  selectedSpirits.forEach((s) => {
    if (!s) return;
    const el = s.element_type || null;
    const sameTypeBuff = el ? shared[el] || 0 : 0;
    
    // 각 정령의 시간대별 DPS 결과를 가져옴
    const spiritDPSResult = calcSpiritDPS(s, combinedBuffs, sameTypeBuff);
    
    // 각 시간대별로 팀 DPS에 합산
    SIM_TIMES.forEach(t => {
      teamDPSByTime[t] += spiritDPSResult.timeResults[t].dps;
    });
  });

  return teamDPSByTime;
}

// ---- 5) 최적 조합 (60초 기준 탐색) ------------------------------------
/**
 * 최적 조합을 60초 기준으로 탐색하되, 결과는 모든 시간대의 DPS를 포함하여 반환합니다.
 */
export function pickBestComboAndDPS(ownedSpirits, buffs) {
  const emptyResult = {
    bestCombo: [],
    bestDPS: SIM_TIMES.reduce((acc, t) => ({ ...acc, [t]: 0 }), {}),
    meta: { exhaustive: false, combinationsTried: 0, searchedCandidates: 0 },
  };

  if (!Array.isArray(ownedSpirits) || ownedSpirits.length === 0) {
    return emptyResult;
  }

  const ranked = ownedSpirits
    .map((s) => ({ ...s, ...calcSpiritDPS(s, buffs) }))
    .sort((a, b) => b.dps - a.dps); // dps는 60초 기준

  if (ranked.length <= 5) {
    const bestDPS = calcTeamDPS(ranked, buffs);
    return { bestCombo: ranked, bestDPS, meta: { exhaustive: true, combinationsTried: 1, searchedCandidates: ranked.length } };
  }

  let candidates = ranked;
  let exhaustive = true;
  if (ranked.length > 25) {
    candidates = ranked.slice(0, 25);
    exhaustive = false;
  }

  const combos = getCombinations(candidates, 5);
  let bestCombo = [];
  let bestDPS = SIM_TIMES.reduce((acc, t) => ({ ...acc, [t]: 0 }), {});

  for (const combo of combos) {
    const dpsByTime = calcTeamDPS(combo, buffs);
    if (dpsByTime[DEFAULT_SIM_TIME] > bestDPS[DEFAULT_SIM_TIME]) {
      bestDPS = dpsByTime;
      bestCombo = combo;
    }
  }

  return {
    bestCombo,
    bestDPS,
    meta: { exhaustive, searchedCandidates: candidates.length, combinationsTried: combos.length },
  };
}

// nCr 조합 생성
function getCombinations(arr, r) {
  const res = [];
  const n = arr.length;
  if (r > n) return res;
  const idx = Array.from({ length: r }, (_, i) => i);
  const push = () => res.push(idx.map((i) => arr[i]));
  push();
  while (true) {
    let i = r - 1;
    while (i >= 0 && idx[i] === i + n - r) i--;
    if (i < 0) break;
    idx[i]++;
    for (let j = i + 1; j < r; j++) idx[j] = idx[j - 1] + 1;
    push();
  }
  return res;
}
