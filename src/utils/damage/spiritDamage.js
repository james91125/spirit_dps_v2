import { num, ELEMENT_MAP } from './constants';

export function calculateSpiritTotalDamage(spirit, uiBuffs, teamContext, simTime) {
  const coef = num(spirit['공격력 계수']);
  const speed = num(spirit['공격속도']);
  const charAttack = num(uiBuffs.charAttack, 1);

  const finalAttack = num(uiBuffs.finalAttack);
  const spiritAmp = num(uiBuffs.spiritAttackAmplify);
  const typeAmp = num(uiBuffs[`${ELEMENT_MAP[spirit.element_type]}Amplify`]);

  const selfElBuffKey = `${ELEMENT_MAP[spirit.element_type]}_type_buff`;
  const sharedTypeBuff = (teamContext.sharedBuffs[spirit.element_type] || 0) - num(spirit[selfElBuffKey]);
  
  const characterBuff = teamContext.characterBuffs.total - num(spirit.character_type_buff);
  const uniqueBuff = num(spirit.character_type_buff);

  const staticBuffSum = spiritAmp + typeAmp + sharedTypeBuff + characterBuff + uniqueBuff;
  const staticBuffMultiplier = 1 + staticBuffSum / 100;
  const finalAttackMultiplier = 1 + finalAttack / 100;

  let totalBasicAttackDamage = 0;
  let totalSkillDamage = 0;
  let baseDpsBreakdown = 0;
  let skillDpsBreakdown = 0;
  let buffUptimeBreakdown = 0;

  const skillDamagePercent = num(spirit.element_damage_percent);
  const skillHitCount = num(spirit.element_damage_hitCount, 1);
  const skillCooldown = num(spirit.element_damage_delay, 0);
  const skillDuration = num(spirit.element_type_buff_time, 0);

  if (skillDamagePercent > 0 && skillCooldown > 0) {
    const numCasts = Math.floor(simTime / skillCooldown);
    const skillDamagePerCast = (skillDamagePercent / 100) * skillHitCount * (coef + staticBuffMultiplier - 1);
    totalSkillDamage = numCasts * skillDamagePerCast;
    skillDpsBreakdown = totalSkillDamage / simTime;
  }
  
  if (skillDuration > 0 && skillCooldown > 0 && teamContext.activeBuffs[spirit.name]) {
    const buffPercent = num(teamContext.activeBuffs[spirit.name].value);
    const numCasts = Math.floor(simTime / skillCooldown);
    const actualBuffUptime = Math.min(simTime, numCasts * skillDuration);
    const downtime = simTime - actualBuffUptime;

    const buffedTotalMultiplier = 1 + (staticBuffSum + buffPercent) / 100;
    const dpsBuffOn = speed * (coef + buffedTotalMultiplier - 1);
    const dpsBuffOff = speed * (coef + staticBuffMultiplier - 1);

    totalBasicAttackDamage = (dpsBuffOn * actualBuffUptime) + (dpsBuffOff * downtime);
    baseDpsBreakdown = totalBasicAttackDamage / simTime;
    buffUptimeBreakdown = (actualBuffUptime / simTime) * 100;
  } else {
    const baseDps = speed * (coef + staticBuffMultiplier - 1);
    totalBasicAttackDamage = baseDps * simTime;
    baseDpsBreakdown = totalBasicAttackDamage / simTime;
  }
  
  const totalDamage = (totalBasicAttackDamage + totalSkillDamage) * finalAttackMultiplier * charAttack;

  return {
    totalDamage: totalDamage,
    dps: totalDamage / simTime,
    breakdown: {
      base: baseDpsBreakdown * charAttack,
      skill: skillDpsBreakdown * charAttack,
      buffUptime: buffUptimeBreakdown,
    },
  };
}

export function calculateTeamSpiritDamage(team, uiBuffs, teamContext, simTime) {
  let totalTeamDamage = 0;
  const spiritMetrics = team.map(spirit => {
    const metrics = calculateSpiritTotalDamage(spirit, uiBuffs, teamContext, simTime);
    totalTeamDamage += metrics.totalDamage;
    return { ...spirit, timeResults: { [simTime]: metrics } };
  });
  return { totalDamage: totalTeamDamage, spiritMetrics };
}
