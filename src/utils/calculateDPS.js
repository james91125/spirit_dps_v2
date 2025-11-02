import { getCombinations } from './combinations';

// =====================================================================================
// HELPERS
// =====================================================================================

const num = (v, def = 0) => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
  return Number.isFinite(n) ? n : def;
};

const ELEMENT_MAP = {
  '불': 'fire', '물': 'water', '풀': 'grass', '빛': 'light', '어둠': 'dark'
};

export const SIM_TIMES = [30, 40, 60];

// =====================================================================================
// CORE CALCULATION
// =====================================================================================

function calculateSpiritMetrics(spirit, uiBuffs, teamContext) {
  const coef = num(spirit['공격력 계수']);
  const speed = num(spirit['공격속도']);
  const spiritEl = spirit.element_type;

  const finalAttack = num(uiBuffs.finalAttack);
  const spiritAmp = num(uiBuffs.spiritAttackAmplify);
  const typeAmp = num(uiBuffs[`${ELEMENT_MAP[spiritEl]}Amplify`]);

  const selfElBuffKey = `${ELEMENT_MAP[spiritEl]}_type_buff`;
  const sharedTypeBuff = (teamContext.sharedBuffs[spiritEl] || 0) - num(spirit[selfElBuffKey]);
  const characterBuff = teamContext.characterBuffs.total - num(spirit.character_type_buff);
  const uniqueBuff = num(spirit.character_type_buff);

  const totalBuffSum = spiritAmp + typeAmp + sharedTypeBuff + characterBuff + uniqueBuff;

  const skillDamagePercent = num(spirit.element_damage_percent);
  let baseDps = 0;
  let skillDps = 0;

  const buffMultiplier = 1 + totalBuffSum / 100;
  const finalAttackMultiplier = 1 + finalAttack / 100;

  if (skillDamagePercent > 0) {
    const hitCount = num(spirit.element_damage_hitCount, 1);
    const cooldown = num(spirit.element_damage_delay, 1);
    const baseSkillDps = (skillDamagePercent / 100 * hitCount) / cooldown;
    skillDps = baseSkillDps * (coef + buffMultiplier - 1) * finalAttackMultiplier;
  } else {
    baseDps = speed * (coef + buffMultiplier - 1) * finalAttackMultiplier;
  }

  const totalDps = baseDps + skillDps;

  return {
    dps: totalDps,
    breakdown: {
      base: baseDps,
      skillDPS: skillDps,
      buffDPS: 0,
      buffUptime: 100,
    },
  };
}

function calculateTeamMetrics(team, uiBuffs) {
  if (!team || team.length === 0) return { totalDps: 0, spiritMetrics: [] };

  const teamContext = createTeamContext(team);
  let totalDps = 0;

  const spiritMetrics = team.map(spirit => {
    const metrics = calculateSpiritMetrics(spirit, uiBuffs, teamContext);
    totalDps += metrics.dps;
    return metrics;
  });

  return { totalDps, spiritMetrics };
}

function createTeamContext(team) {
  const context = {
    sharedBuffs: { '불': 0, '물': 0, '풀': 0, '빛': 0, '어둠': 0 },
    characterBuffs: { total: 0 },
  };
  team.forEach(s => {
    if (!s) return;
    Object.keys(context.sharedBuffs).forEach(el => {
      const key = `${ELEMENT_MAP[el]}_type_buff`;
      context.sharedBuffs[el] += num(s[key]);
    });
    context.characterBuffs.total += num(s.character_type_buff);
  });
  return context;
}

function calculateSkillMetrics(skill, uiBuffs) {
  const damagePercent = num(skill.damagePercent);
  const hitCount = num(skill.hitCount, 1);
  const cooldown = num(skill.cooltime, 1);
  const attackAmplify = num(uiBuffs.attackAmplify);

  if (cooldown === 0) return { dps: 0, breakdown: {} };

  const baseDps = (damagePercent / 100 * hitCount) / cooldown;
  const totalDps = baseDps * (1 + attackAmplify / 100);

  return {
    dps: totalDps,
    breakdown: { base: totalDps, skillDPS: 0, buffDPS: 0, buffUptime: 0 },
  };
}

// =====================================================================================
// ENTRYPOINT
// =====================================================================================

export function calculateFinalResults(ownedSpirits, ownedSkills, uiBuffs) {
  const { bestCombo, meta } = pickBestCombo(ownedSpirits, uiBuffs);

  const sortedSkills = ownedSkills
    .map(skill => ({
      ...skill,
      ...calculateSkillMetrics(skill, uiBuffs),
    }))
    .sort((a, b) => b.dps - a.dps);

  const skillMetrics = ownedSkills.length > 5 ? sortedSkills.slice(0, 5) : sortedSkills;

  const totalSkillDps = skillMetrics.reduce((sum, s) => sum + s.dps, 0);

  const result = {
    currentDPS: {},
    bestDPS: {},
    bestCombo: [],
    bestSkills: skillMetrics,
    meta,
  };

  SIM_TIMES.forEach(time => {
    const { totalDps: spiritTotalDps, spiritMetrics } = calculateTeamMetrics(bestCombo, uiBuffs);
    const totalDps = spiritTotalDps + totalSkillDps;

    result.bestDPS[time] = totalDps;
    result.currentDPS[time] = totalDps;

    bestCombo.forEach((spirit, index) => {
      if (!result.bestCombo[index]) {
        result.bestCombo[index] = { ...spirit, timeResults: {} };
      }
      result.bestCombo[index].timeResults[time] = spiritMetrics[index];
    });
  });

  return result;
}

function pickBestCombo(ownedSpirits, uiBuffs) {
  if (!ownedSpirits || ownedSpirits.length <= 5) {
    return { bestCombo: ownedSpirits, meta: { exhaustive: true, searchedCandidates: ownedSpirits.length } };
  }

  const candidates = ownedSpirits.map(s => {
      const skillDps = (num(s.element_damage_percent) / 100 * num(s.element_damage_hitCount, 1)) / num(s.element_damage_delay, 1);
      const baseScore = num(s['공격력 계수']) * num(s['공격속도']) + skillDps;
      return { ...s, baseScore };
    })
    .sort((a, b) => b.baseScore - a.baseScore)
    .slice(0, 20);

  const combos = getCombinations(candidates, 5);
  let bestDPS = 0;
  let bestCombo = [];

  for (const combo of combos) {
    const { totalDps } = calculateTeamMetrics(combo, uiBuffs);
    if (totalDps > bestDPS) {
      bestDPS = totalDps;
      bestCombo = combo;
    }
  }

  return {
    bestCombo,
    meta: {
      exhaustive: false,
      searchedCandidates: candidates.length,
      combinationsTried: combos.length,
    },
  };
}