// src/utils/calculateDPS.js
import { spiritsData } from '../data/spiritsData';
import { skillData } from '../data/skillData';
import { calculateCharacterDamage } from './damage/characterDamage';
import { createSpiritBuffContext } from './damage/context';
import { calculateSpiritAADamage } from './damage/spiritDamage';
import { calculateSpiritSkillDamage } from './damage/skillDamage';
import { num } from './damage/constants';

/**
 * 모든 데미지를 총괄 계산하는 메인 함수
 * @param {object} uiBuffs - UI에서 입력된 버프 값
 * @param {Array<object>} equippedSpirits - 장착된 정령 목록
 * @param {Array<object>} equippedSkills - 장착된 스킬 목록
 * @param {number} simTime - 시뮬레이션 시간
 * @returns {object} 최종 DPS 결과 객체
 */
export function calculateTotalDPS(uiBuffs, equippedSpirits, equippedSkills, simTime = 30) {
  const fullSpiritsData = equippedSpirits.map(s => spiritsData.find(sd => sd.name === s.name)).filter(Boolean);

  // 1. 모든 버프 집계
  const totalBuffs = { ...uiBuffs };
  let charAttackAmplifyFromSpirits = 0;
  fullSpiritsData.forEach(s => {
    charAttackAmplifyFromSpirits += num(s.character_type_buff);
  });
  totalBuffs.attackAmplify = num(totalBuffs.attackAmplify) + charAttackAmplifyFromSpirits;
  
  // 2. 캐릭터 데미지 계산
  const charResult = calculateCharacterDamage(totalBuffs);
  const charTotalDamage = charResult.dps * simTime;

  // 3. 정령 상호 버프 컨텍스트 생성
  const buffContext = createSpiritBuffContext(equippedSpirits, totalBuffs);

  // 4. 각 정령의 데미지 계산
  const spiritResults = [];
  let totalSpiritDPS = 0;

  for (const spiritData of fullSpiritsData) {
    const spiritAAResult = calculateSpiritAADamage(spiritData, totalBuffs, charResult.nonCritDamagePerHit, buffContext);
    const spiritSkillResult = calculateSpiritSkillDamage(spiritData, spiritAAResult.damagePerHit, simTime);
    const totalDps = spiritAAResult.dps + spiritSkillResult.dps;
    totalSpiritDPS += totalDps;

    spiritResults.push({
      name: spiritData.name,
      element: spiritData.element_type,
      totalDamage: (spiritAAResult.dps * simTime) + spiritSkillResult.totalDamage,
      dps: totalDps,
      breakdown: {
        base: spiritAAResult.dps,
        skill: spiritSkillResult.dps,
        casts: spiritSkillResult.casts,
        damagePerHit: spiritAAResult.damagePerHit, // 1방당 데미지를 breakdown으로 이동
      },
    });
  }

  // 5. 캐릭터 스킬 데미지 계산
  const skillResults = [];
  let totalSkillDPS = 0;
  const critDamageMultiplier = num(totalBuffs.critDamage) / 100;
  const avgCritModifier = (1 - charResult.critChance) + (charResult.critChance * critDamageMultiplier);

  for (const skill of equippedSkills) {
      const skillInfo = skillData.find(s => s.name === skill.name);
      if (!skillInfo || !skillInfo.damagePercent) {
          skillResults.push({ name: skill.name, dps: 0, totalDamage: 0, casts: 0 }); // Add casts for character skills
          continue;
      }

      const damagePerHitNonCrit = charResult.nonCritDamagePerHit * (num(skillInfo.damagePercent) / 100);
      const avgDamagePerHit = damagePerHitNonCrit * avgCritModifier;
      
      const hitsPerCast = num(skillInfo.hitCount, 1);
      const cooldown = num(skillInfo.cooltime, 1);
      
      const casts = cooldown > 0 ? Math.floor(simTime / cooldown) : 0;
      const totalDamage = avgDamagePerHit * hitsPerCast * casts;
      const dps = totalDamage / simTime;
      totalSkillDPS += dps;

      skillResults.push({
          name: skill.name,
          dps: dps,
          totalDamage: totalDamage,
          casts: casts, // Add casts for character skills
      });
  }

  // 6. 최종 결과 취합
  const totalDPS = charResult.dps + totalSpiritDPS + totalSkillDPS;
  const totalDamage = totalDPS * simTime;

  return {
    char: {
      ...charResult,
      totalDamage: charTotalDamage,
    },
    spirits: spiritResults,
    skills: skillResults,
    total: {
      dps: totalDPS,
      totalDamage,
    },
  };
}