// src/utils/damage/spiritDamage.js
import { num } from './constants';

/**
 * 정령의 평타(AA) 데미지를 계산합니다.
 * @param {object} spiritData - 개별 정령의 데이터
 * @param {object} uiBuffs - UI 버프 값
 * @param {number} charNonCritDamagePerHit - 캐릭터의 기본 공격 데미지
 * @param {object} buffContext - createSpiritBuffContext로 생성된 버프 컨텍스트
 * @returns {object} 정령 평타 데미지 관련 지표
 */
export function calculateSpiritAADamage(spiritData, uiBuffs, charNonCritDamagePerHit, buffContext) {
  const spiritCoef = num(spiritData['공격력 계수']);
  const spiritAttackSpeed = num(spiritData['공격속도']);
  const spiritAmp = num(uiBuffs.spiritAttackAmplify);
  
  // 컨텍스트에서 해당 정령의 최종 속성 증폭 값을 가져옴
  const totalElementAmp = buffContext[spiritData.name]?.totalElementAmp || 0;

  // 최종 배율 및 데미지 계산
  const spiritMultiplier = spiritCoef + (spiritAmp / 100) + (totalElementAmp / 100);
  const damagePerHit = charNonCritDamagePerHit * spiritMultiplier;
  const dps = damagePerHit * spiritAttackSpeed;

  return {
    damagePerHit,
    dps,
  };
}