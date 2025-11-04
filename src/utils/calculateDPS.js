import { spiritsData } from '../data/spiritsData';

const num = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const ELEMENT_MAP = {
  '불': 'fire',
  '물': 'water',
  '풀': 'grass',
  '빛': 'light',
  '어둠': 'dark',
};

/**
 * @param {object} uiBuffs - step1 입력값
 * @param {object} teamContext - 파티 버프 정보
 * @param {array} spirits - 선택된 정령 목록
 * @param {number} simTime - 시뮬레이션 시간 (기본 30, 40, 60초 중 택1)
 */
export function calculateTotalDPS(uiBuffs, teamContext, spirits, simTime = 30) {
  // -------------------------
  // ① 캐릭터 평타 계산
  // -------------------------
  const Attack = num(uiBuffs.charAttack, 1);
  const charAttackSpeed = num(uiBuffs.charAttackSpeed, 1);
  const attackAmplify = num(uiBuffs.attackAmplify);
  const critChance = Math.min(1, num(uiBuffs.critChance) / 100);
  const critDamage = 1 + num(uiBuffs.critDamage) / 100;
  const teamCharBuff = num(teamContext?.characterBuffs?.total);

  const ATTACK_AMPLIFY_SCALING_FACTOR = 1; // 단순화 로직 적용
  let effectiveAttackAmplify = attackAmplify / ATTACK_AMPLIFY_SCALING_FACTOR;

  let spiritCharBuff = 0;
  for (const equippedSpirit of spirits) {
    const fullSpiritData = spiritsData.find(s => s.name === equippedSpirit.name);
    if (fullSpiritData && fullSpiritData.character_type_buff) {
      spiritCharBuff += num(fullSpiritData.character_type_buff);
    }
  }

  const charTotalAmplify = effectiveAttackAmplify + spiritCharBuff + teamCharBuff;
  const charTotalMultiplier = 1 + charTotalAmplify / 100;

  const baseNonCritDamage = Attack * charTotalMultiplier;
  const charNonCritDamagePerHit = baseNonCritDamage;
  const charCritDamagePerHit = baseNonCritDamage * critDamage;
  const critModifier = (1 - critChance) + critChance * critDamage;
  const charDamagePerHit = baseNonCritDamage * critModifier;

  const charDPS = charDamagePerHit * charAttackSpeed;
  const charTotalDamage = charDPS * simTime;

  console.log('--- Character Debug ---');
  console.log('Attack:', Attack);
  console.log('attackAmplify:', attackAmplify);
  console.log('critChance:', critChance);
  console.log('critDamage (multiplier):', critDamage);
  console.log('teamCharBuff:', teamCharBuff);
  console.log('baseNonCritDamage:', baseNonCritDamage);
  console.log('charNonCritDamagePerHit:', charNonCritDamagePerHit);
  console.log('charCritDamagePerHit:', charCritDamagePerHit);
  console.log('charDamagePerHit (average):', charDamagePerHit);
  console.log('charAttackSpeed:', charAttackSpeed);
  console.log('charDPS:', charDPS);
  console.log('charTotalDamage:', charTotalDamage);
  console.log('-----------------------');

  // -------------------------
  // ② 정령 계산 (간소화된 로직)
  // -------------------------
  const results = [];
  let totalSpiritDPS = 0;
  let totalSpiritDamage = 0;

  for (const spirit of spirits) {
    const spiritCoef = num(spirit['공격력 계수']);
    const spiritAttackSpeed = num(spirit['공격속도']);
    const spiritAmp = num(uiBuffs.spiritAttackAmplify);
    const elementKey = ELEMENT_MAP[spirit.element_type] || 'none';
    const elementAmp = num(uiBuffs[`${elementKey}Amplify`]);

    const baseMultiplier = 1 + (attackAmplify + spiritAmp + elementAmp) / 100;
    const baseHitDamage = Attack * spiritCoef * baseMultiplier;
    const baseDPS = baseHitDamage * spiritAttackSpeed;

    const skillDamagePercent = num(spirit.element_damage_percent);
    const skillHitCount = num(spirit.element_damage_hitCount, 1);
    const skillCooldown = num(spirit.element_damage_delay, 0);
    const skillDuration = num(spirit.element_type_buff_time, 0);

    let buffUptime = 0;
    if (skillCooldown > 0 && skillDuration > 0) {
      buffUptime = Math.min(skillDuration / skillCooldown, 1) * 100;
    } else {
      buffUptime = teamContext.activeBuffs?.[spirit.name] ? 100 : 0;
    }

    const totalSkillDamage = Attack * spiritCoef * (skillDamagePercent / 100) * skillHitCount;
    const skillDPS = totalSkillDamage / (skillCooldown || 1); // 0 방지

    const effectiveDPS = baseDPS + skillDPS * (buffUptime / 100);
    const totalFinalDamage = effectiveDPS * simTime;

    totalSpiritDPS += effectiveDPS;
    totalSpiritDamage += totalFinalDamage;

    console.log('--- Spirit Debug:', spirit.name, '---');
    console.log('spiritCoef:', spiritCoef);
    console.log('spiritAttackSpeed:', spiritAttackSpeed);
    console.log('baseMultiplier:', baseMultiplier);
    console.log('baseHitDamage:', baseHitDamage);
    console.log('baseDPS:', baseDPS);
    console.log('buffUptime:', buffUptime);
    console.log('skillDPS:', skillDPS);
    console.log('effectiveDPS:', effectiveDPS);
    console.log('totalFinalDamage:', totalFinalDamage);
    console.log('-----------------------');

    results.push({
      name: spirit.name,
      element: spirit.element_type,
      damagePerHit: baseHitDamage,
      totalDamage: totalFinalDamage,
      dps: effectiveDPS,
      breakdown: {
        base: baseDPS,
        skill: skillDPS,
        buffUptime: buffUptime,
      },
    });
  }

  const totalDPS = charDPS + totalSpiritDPS;
  const totalDamage = charTotalDamage + totalSpiritDamage;

  console.log('=== Total DPS Summary ===');
  console.log('Character DPS:', charDPS.toFixed(2), 'Total Damage:', charTotalDamage.toFixed(2));
  results.forEach(sp => {
    console.log(`Spirit [${sp.name}] DPS: ${sp.dps.toFixed(2)}, Skill DPS: ${sp.breakdown.skill.toFixed(2)}, Buff Uptime: ${sp.breakdown.buffUptime.toFixed(2)}%, Total Damage: ${sp.totalDamage.toFixed(2)}`);
  });
  console.log('Combined Total DPS:', totalDPS.toFixed(2), 'Combined Total Damage:', totalDamage.toFixed(2));
  console.log('=========================');

  return {
    char: {
      damagePerHit: charDamagePerHit,
      nonCritDamagePerHit: charNonCritDamagePerHit,
      critDamagePerHit: charCritDamagePerHit,
      dps: charDPS,
      totalDamage: charTotalDamage,
      critChance: critChance,
    },
    spirits: results,
    total: {
      dps: totalDPS,
      totalDamage,
    },
  };
}
