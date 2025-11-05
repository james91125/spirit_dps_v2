// src/utils/damage/characterDamage.js
import { num } from './constants';

/**
 * @param {object} uiBuffs - UI에서 입력된 버프 값
 * @returns {object} 캐릭터 데미지 관련 지표
 */
export function calculateCharacterDamage(uiBuffs) {
  const Attack = num(uiBuffs.charAttack, 1);
  const charAttackSpeed = num(uiBuffs.charAttackSpeed, 1);
  const attackAmplify = num(uiBuffs.attackAmplify);
  const critChance = Math.min(1, num(uiBuffs.critChance) / 100);
  const critDamageMultiplier = num(uiBuffs.critDamage) / 100;

  // 캐릭터 총 공격력 증폭 계산 (기본값 100% 제외)
  const charTotalAmplify = attackAmplify - 100;
  const charTotalMultiplier = 1 + charTotalAmplify / 100;

  // 데미지 계산
  const nonCritDamagePerHit = Attack * charTotalMultiplier;
  const critDamagePerHit = nonCritDamagePerHit * critDamageMultiplier;

  // 평균 데미지 및 DPS
  const avgCritModifier = (1 - critChance) + (critChance * critDamageMultiplier);
  const damagePerHit = nonCritDamagePerHit * avgCritModifier;
  const dps = damagePerHit * charAttackSpeed;

  return {
    nonCritDamagePerHit,
    critDamagePerHit,
    damagePerHit,
    dps,
    critChance,
  };
}