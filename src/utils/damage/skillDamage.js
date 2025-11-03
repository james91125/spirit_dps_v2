import { num } from './constants';

export function calculateSkillTotalDamage(skill, uiBuffs, teamContext, simTime) {
  const damagePercent = num(skill.damagePercent);
  const hitCount = num(skill.hitCount, 1);
  const cooldown = num(skill.cooltime, 1);
  
  const charAttack = num(uiBuffs.charAttack, 1);
  const teamCharBuff = num(teamContext.characterBuffs.total);
  const attackAmplify = num(uiBuffs.attackAmplify) + teamCharBuff;
  const critChance = num(uiBuffs.critChance) / 100;
  const critDamage = 1 + num(uiBuffs.critDamage) / 100;

  if (cooldown === 0 || damagePercent === 0) return { totalDamage: 0, dps: 0 };

  const critModifier = (1 - critChance) + (critChance * critDamage);
  const numCasts = Math.floor(simTime / cooldown);
  const damagePerCast = (damagePercent / 100) * hitCount;
  const totalDamage = numCasts * damagePerCast * (1 + attackAmplify / 100) * charAttack * critModifier;

  return { totalDamage, dps: totalDamage / simTime };
}