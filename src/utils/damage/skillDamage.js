// src/utils/damage/skillDamage.js
import { num } from './constants';

/**
 * 정령의 스킬 데미지를 계산합니다. (추정치)
 * @param {object} spiritData - 개별 정령의 데이터
 * @param {number} spiritAADamagePerHit - 해당 정령의 평타 데미지
 * @returns {object} 정령 스킬 데미지 관련 지표
 */
export function calculateSpiritSkillDamage(spiritData, spiritAADamagePerHit, simTime) {
  const skillDamagePercent = num(spiritData.element_damage_percent);
  const skillHitCount = num(spiritData.element_damage_hitCount, 1);
  const cooldown = num(spiritData.element_damage_delay, 1);

  if (skillDamagePercent === 0 || skillHitCount === 0 || cooldown === 0) {
    return { dps: 0, totalDamage: 0, damagePerHit: 0 };
  }

  // 스킬의 타격당 데미지
  const damagePerHit = spiritAADamagePerHit * (skillDamagePercent / 100);
  
  // 시뮬레이션 시간 기반 DPS 계산
  const casts = Math.floor(simTime / cooldown);
  const totalDamage = damagePerHit * skillHitCount * casts;
  const dps = totalDamage / simTime;

  return {
    dps,
    totalDamage,
    damagePerHit,
    casts,
  };
}
