// src/utils/damage/context.js
import { num, ELEMENT_MAP } from './constants';
import { spiritsData as allSpiritsData } from '../../data/spiritsData';

/**
 * 장착된 정령 팀을 기반으로 각 정령이 받게 될 최종 버프 컨텍스트를 생성
 * @param {Array<object>} equippedSpirits - 장착된 정령 목록
 * @param {object} uiBuffs - UI 버프 값
 * @returns {object} 각 정령의 이름를 키로, 최종 버프 값을 값으로 갖는 맵
 */
export function createSpiritBuffContext(equippedSpirits, uiBuffs) {
  const context = {};
  const fullSpiritsData = equippedSpirits.map(s => allSpiritsData.find(sd => sd.name === s.name)).filter(Boolean);

  for (const currentSpirit of fullSpiritsData) {
    const elementKey = ELEMENT_MAP[currentSpirit.element_type];
    let totalElementAmp = num(uiBuffs[`${elementKey}Amplify`]);

    // 나를 제외한 다른 정령들의 버프를 확인하고, 현재 정령의 속성과 일치하면 합산
    for (const otherSpirit of fullSpiritsData) {
      // 자기 버프가 팀버프와 중첩 X
      if (currentSpirit.name === otherSpirit.name) continue;
      
      const buffKey = `${elementKey}_type_buff`;
      if (otherSpirit[buffKey]) {
        totalElementAmp += num(otherSpirit[buffKey]);
      }
    }
    
    context[currentSpirit.name] = {
      totalElementAmp,
    };
  }

  return context;
}