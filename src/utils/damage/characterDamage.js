import { num } from './constants';

export function calculateCharacterTotalDamage(uiBuffs, teamContext, simTime) {
    const charAttack = num(uiBuffs.charAttack, 1);
    const charAttackSpeed = num(uiBuffs.charAttackSpeed) + num(teamContext.characterBuffs.attackSpeed) / 100;

    // 캐릭터 공격력 증폭
    const teamCharBuff = num(teamContext.characterBuffs.total);
    const attackAmplify = num(uiBuffs.attackAmplify) + teamCharBuff;

    // 치명타
    const critChance = Math.min(1, (num(uiBuffs.critChance) + num(teamContext.characterBuffs.critRate)) / 100);
    const critDamage = 1 + num(uiBuffs.critDamage) / 100;
    const critModifier = (1 - critChance) + (critChance * critDamage);

    // 방어력 계수 적용 (적 방어력 반영)
    const defenseCoef = num(teamContext.enemyDefenseCoef || 0.686);

    // 속성 증폭 (예: 불/물/풀/빛/어둠)
    const typeAmplifyKeys = ['fireAmplify', 'waterAmplify', 'grassAmplify', 'lightAmplify', 'darkAmplify'];
    let typeMultiplier = 1;
    for (const key of typeAmplifyKeys) {
        if (uiBuffs[key] > 0) typeMultiplier *= 1 + num(uiBuffs[key]) / 100;
    }

    if (charAttack === 0 || charAttackSpeed === 0) return { totalDamage: 0, dps: 0 };

    const baseDps = charAttack * charAttackSpeed * (1 + attackAmplify / 100) * critModifier * defenseCoef * typeMultiplier;
    const totalDamage = baseDps * simTime;

    return { totalDamage, dps: baseDps };
}
