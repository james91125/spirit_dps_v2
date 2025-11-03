import { num } from './constants';

export function calculateCharacterTotalDamage(uiBuffs, teamContext, simTime) {
    const charAttack = num(uiBuffs.charAttack, 1);
    const charAttackSpeed = num(uiBuffs.charAttackSpeed) + num(teamContext.characterBuffs.attackSpeed) / 100;
    const teamCharBuff = num(teamContext.characterBuffs.total);
    const attackAmplify = num(uiBuffs.attackAmplify) + teamCharBuff;
    const critChance = Math.min(1, (num(uiBuffs.critChance) + num(teamContext.characterBuffs.critRate)) / 100);
    const critDamage = 1 + num(uiBuffs.critDamage) / 100;

    if (charAttack === 0 || charAttackSpeed === 0) return { totalDamage: 0, dps: 0 };

    const critModifier = (1 - critChance) + (critChance * critDamage);
    const baseDps = charAttack * charAttackSpeed * (1 + attackAmplify / 100) * critModifier;
    const totalDamage = baseDps * simTime;

    return { totalDamage, dps: baseDps };
}