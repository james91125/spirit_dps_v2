// spiritDamage.js
import { num, ELEMENT_MAP } from './constants';

/**
 * 개별 정령 데미지 계산
 */
export function calculateSpiritTotalDamage(spirit, uiBuffs, teamContext, simTime) {
  const coef = num(spirit['공격력 계수']);           // 정령 계수
  const speed = num(spirit['공격속도']);             // 정령 공격속도
  const charAttack = num(uiBuffs.charAttack, 1);     // 캐릭터 공격력

  const finalAttack = num(uiBuffs.finalAttack);      // 최종 공격력 증폭 (ex. 10%)
  const spiritAmp = num(uiBuffs.spiritAttackAmplify);
  const typeAmp = num(uiBuffs[`${ELEMENT_MAP[spirit.element_type]}Amplify`]);

  const selfElBuffKey = `${ELEMENT_MAP[spirit.element_type]}_type_buff`;
  const sharedTypeBuff = (teamContext.sharedBuffs[spirit.element_type] || 0) - num(spirit[selfElBuffKey]);

  const staticBuffSum = spiritAmp + typeAmp + sharedTypeBuff;
  const staticBuffMultiplier = 1 + staticBuffSum / 100;

  const finalAttackMultiplier = 1 + finalAttack / 100;

  // 스킬 관련
  const skillDamagePercent = num(spirit.element_damage_percent);
  const skillHitCount = num(spirit.element_damage_hitCount, 1);
  const skillCooldown = num(spirit.element_damage_delay, 0);
  const skillDuration = num(spirit.element_type_buff_time, 0);

  let totalBasicAttackDamage = 0;
  let totalSkillDamage = 0;
  let baseDpsBreakdown = 0;
  let skillDpsBreakdown = 0;
  let buffUptimeBreakdown = 0;

  // 스킬 데미지 계산
  if (skillDamagePercent > 0 && skillCooldown > 0) {
    const numCasts = Math.floor(simTime / skillCooldown);
    const skillDamagePerCast = (skillDamagePercent / 100) * skillHitCount * coef * staticBuffMultiplier;
    totalSkillDamage = numCasts * skillDamagePerCast * charAttack * finalAttackMultiplier;
    skillDpsBreakdown = totalSkillDamage / simTime;
  }

  // 버프 지속시간이 있는 경우
  if (skillDuration > 0 && skillCooldown > 0 && teamContext.activeBuffs[spirit.name]) {
    const buffPercent = num(teamContext.activeBuffs[spirit.name].value);
    const numCasts = Math.floor(simTime / skillCooldown);
    const actualBuffUptime = Math.min(simTime, numCasts * skillDuration);
    const downtime = simTime - actualBuffUptime;

    const buffedMultiplier = 1 + (staticBuffSum + buffPercent) / 100;
    const unbuffedMultiplier = staticBuffMultiplier;

    const dpsBuffOn = speed * coef * buffedMultiplier;
    const dpsBuffOff = speed * coef * unbuffedMultiplier;

    totalBasicAttackDamage = (dpsBuffOn * actualBuffUptime + dpsBuffOff * downtime) * charAttack * finalAttackMultiplier;
    baseDpsBreakdown = totalBasicAttackDamage / simTime / (charAttack * finalAttackMultiplier);
    buffUptimeBreakdown = (actualBuffUptime / simTime) * 100;
  } 
  // 기본 공격만 있을 경우
  else {
    const baseDps = speed * coef * staticBuffMultiplier;
    totalBasicAttackDamage = baseDps * simTime * charAttack * finalAttackMultiplier;
    baseDpsBreakdown = baseDps;
  }

  const totalDamage = totalBasicAttackDamage + totalSkillDamage;

  // 기존 로그 스타일
  console.log('calculateDPS.js:188 sharedBuff:', sharedTypeBuff);
  console.log('calculateDPS.js:189 activeBuff:', teamContext.activeBuffs[spirit.name]?.value || 0);
  console.log('calculateDPS.js:190 defenseReduction:', 0);
  console.log('calculateDPS.js:191 enemyDefense:', 1);
  console.log('calculateDPS.js:192 baseMultiplier:', staticBuffMultiplier);
  console.log('calculateDPS.js:193 baseHitDamage:', coef * charAttack * staticBuffMultiplier);
  console.log('calculateDPS.js:194 baseDPS:', baseDpsBreakdown * charAttack * finalAttackMultiplier);
  console.log('calculateDPS.js:195 buffUptime:', buffUptimeBreakdown);
  console.log('calculateDPS.js:196 buffedMultiplier:', staticBuffMultiplier);
  console.log('calculateDPS.js:197 buffedHitDamage:', coef * charAttack * staticBuffMultiplier);
  console.log('calculateDPS.js:198 buffedDPS:', baseDpsBreakdown * charAttack * finalAttackMultiplier);
  console.log('calculateDPS.js:199 effectiveDPS:', baseDpsBreakdown * charAttack * finalAttackMultiplier);
  console.log('calculateDPS.js:200 totalFinalDamage (spirit only):', totalBasicAttackDamage);
  console.log('calculateDPS.js:201 totalFinalDPS (spirit only):', baseDpsBreakdown * charAttack * finalAttackMultiplier);
  console.log('calculateDPS.js:202 totalSkillDamage:', totalSkillDamage);
  console.log('calculateDPS.js:203 skillDPS:', skillDpsBreakdown);
  console.log('calculateDPS.js:204 -----------------------');

  return {
    totalDamage,
    dps: totalDamage / simTime,
    breakdown: {
      base: baseDpsBreakdown,
      skill: skillDpsBreakdown,
      buffUptime: buffUptimeBreakdown,
    },
  };
}

/**
 * 팀 전체 정령 데미지 계산
 */
export function calculateTeamSpiritDamage(team, uiBuffs, teamContext, simTime) {
  let totalTeamDamage = 0;
  const spiritMetrics = team.map(spirit => {
    const metrics = calculateSpiritTotalDamage(spirit, uiBuffs, teamContext, simTime);
    totalTeamDamage += metrics.totalDamage;
    return { ...spirit, timeResults: { [simTime]: metrics } };
  });
  return { totalDamage: totalTeamDamage, spiritMetrics };
}
