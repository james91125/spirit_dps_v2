// ✅ src/utils/calculateDPS.js
// 모든 버프는 % 단위로 처리, 공격계수와 속도는 절대값이다.

/**
 * 개별 정령 DPS 계산
 * 공식:
 *   DPS = 속도 × (계수 + ((정령공증 + 속성증폭 + 고유버프 + 같은속성공유버프) / 100))
 *              × (1 + (최종공격력 / 100))
 */
export function calcSpiritDPS(spirit, buffs, sameTypeBuff = 0) {
  if (!spirit) return { dps: 0 };

  const speed = Number(spirit.character_attack_speed || 0);
  const coef = Number(spirit.character_attack_coef || 0);
  const element = spirit.element_type || null;

  // 외부 입력 버프 (% 단위)
  const spiritAmp = Number(buffs.spiritAttackAmplify || 0);
  const finalAttack = Number(buffs.finalAttack || 0);

  // 속성별 증폭 (% 단위)
  const typeAmpMap = {
    FIRE: Number(buffs.fireAmplify || 0),
    WATER: Number(buffs.waterAmplify || 0),
    GRASS: Number(buffs.grassAmplify || 0),
    LIGHT: Number(buffs.lightAmplify || 0),
    DARK: Number(buffs.darkAmplify || 0),
  };
  const typeAmp = typeAmpMap[element] || 0;

  // 고유 버프 (character_ 형태만 자신에게 적용)
  let uniqueTypeBuff = 0;
  if (spirit.buff_target_type?.startsWith("character_")) {
    uniqueTypeBuff = Number(spirit.buff_value || 0);
  }

  // 같은 속성 공유 버프 (%)
  const sharedBuff = Number(sameTypeBuff || 0);

  const dps =
    speed *
    (coef + (spiritAmp + typeAmp + uniqueTypeBuff + sharedBuff) / 100) *
    (1 + finalAttack / 100);

  return {
    dps,
    speed,
    coef,
    spiritAmp,
    typeAmp,
    uniqueTypeBuff,
    sharedBuff,
    finalAttack,
  };
}

/**
 * 팀 전체 DPS 계산
 * - element_*** → 같은 속성 공유 버프
 * - character_*** → 팀 전체 버프 (공격력/공속)
 */
export function calcTeamDPS(selectedSpirits, buffs) {
  if (!Array.isArray(selectedSpirits) || selectedSpirits.length === 0) return 0;

  // 속성 공유 버프 누적
  const sharedBuffs = { FIRE: 0, WATER: 0, GRASS: 0, LIGHT: 0, DARK: 0 };

  // 팀 전체 버프 누적
  const teamWideBuffs = {
    character_attack: 0,
    character_attack_speed: 0,
  };

  selectedSpirits.forEach((s) => {
    if (!s || !s.buff_target_type) return;

    // 속성 공유 버프
    if (s.buff_target_type.startsWith("element_")) {
      const el = s.buff_target_type.split("_")[1]?.toUpperCase();
      if (el && sharedBuffs[el] != null) {
        sharedBuffs[el] += Number(s.buff_value || 0);
      }
    }

    // 팀 전체 버프
    if (s.buff_target_type.startsWith("character_")) {
      const key = s.buff_target_type;
      if (teamWideBuffs[key] != null) {
        teamWideBuffs[key] += Number(s.buff_value || 0);
      }
    }
  });

  // 각 정령별 DPS 합산
  return selectedSpirits.reduce((sum, s) => {
    if (!s) return sum;

    const el = s.element_type || null;
    const sameTypeBuff = el ? sharedBuffs[el] || 0 : 0;

    // 팀 전체 버프 적용
    const combinedBuffs = {
      ...buffs,
      spiritAttackAmplify:
        Number(buffs.spiritAttackAmplify || 0) + (teamWideBuffs.character_attack || 0),
      finalAttack: Number(buffs.finalAttack || 0),
    };

    // 공격속도 버프는 속도에 직접 반영
    const modifiedSpirit = {
      ...s,
      character_attack_speed:
        Number(s.character_attack_speed || 0) *
        (1 + (teamWideBuffs.character_attack_speed || 0) / 100),
    };

    const { dps } = calcSpiritDPS(modifiedSpirit, combinedBuffs, sameTypeBuff);
    return sum + dps;
  }, 0);
}

/**
 * 완전탐색 기반 최적 조합 (5마리 이하 시 그대로 사용)
 */
export function pickBestComboAndDPS(ownedSpirits, buffs) {
  if (!Array.isArray(ownedSpirits) || ownedSpirits.length === 0)
    return { bestCombo: [], bestDPS: 0 };

  // 근사 후보 정렬 (공속×계수)
  const withBaseScore = ownedSpirits
    .map((s) => ({
      ...s,
      baseScore:
        Number(s.character_attack_coef || 0) *
        Number(s.character_attack_speed || 0),
    }))
    .sort((a, b) => b.baseScore - a.baseScore);

  // 5마리 이하 시 그대로 사용
  if (withBaseScore.length <= 5) {
    const comboWithDPS = withBaseScore.map((s) => {
      const { dps } = calcSpiritDPS(s, buffs, 0);
      return { ...s, dps };
    });
    const total = calcTeamDPS(comboWithDPS, buffs);
    return {
      bestCombo: comboWithDPS,
      bestDPS: total,
      meta: { exhaustive: false, note: "선택 정령 5마리 이하 — 그대로 사용" },
    };
  }

  // 25마리 초과 시 상위 25명 근사탐색
  let candidates = withBaseScore;
  let exhaustive = true;
  if (withBaseScore.length > 25) {
    candidates = withBaseScore.slice(0, 25);
    exhaustive = false;
  }

  const combos = getCombinations(candidates, 5);
  let bestCombo = [];
  let bestDPS = 0;

  for (const combo of combos) {
    const teamDPS = calcTeamDPS(combo, buffs);
    if (teamDPS > bestDPS) {
      // 각 정령별 DPS 동기화
      const comboWithDPS = combo.map((s) => {
        const { dps } = calcSpiritDPS(s, buffs, 0);
        return { ...s, dps };
      });
      bestCombo = comboWithDPS;
      bestDPS = teamDPS;
    }
  }

  return {
    bestCombo,
    bestDPS,
    meta: {
      exhaustive,
      searchedCandidates: candidates.length,
      combinationsTried: combos.length,
    },
  };
}

/** 조합 유틸 */
function getCombinations(arr, r) {
  const res = [];
  const n = arr.length;
  if (r > n) return res;

  const idx = Array.from({ length: r }, (_, i) => i);
  const pushCombo = () => res.push(idx.map((i) => arr[i]));

  pushCombo();
  while (true) {
    let i = r - 1;
    while (i >= 0 && idx[i] === i + n - r) i--;
    if (i < 0) break;
    idx[i]++;
    for (let j = i + 1; j < r; j++) idx[j] = idx[j - 1] + 1;
    pushCombo();
  }
  return res;
}
