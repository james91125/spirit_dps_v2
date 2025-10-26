// src/utils/calculateDPS.js
export function calcSpiritDPS(spirit, buffs, sharedBuff = 0) {
  if (!spirit) return 0;

  // 기본 공격력 (계수 × 속도)
  const base =
    Number(spirit.character_attack_coef || spirit.attackCoef) *
    Number(spirit.character_attack_speed || spirit.attackSpeed);

  // 공격력 관련 버프 합계
  const attackAmp =
    Number(buffs.attackAmplify || 0) +
    Number(buffs.spiritAttackAmplify || 0) +
    (spirit.buffType === 'attack' ? Number(spirit.buffValue || 0) : 0);

  // 타입별 증폭
  const typeMap = {
    FIRE: Number(buffs.fireAmplify || 0),
    WATER: Number(buffs.waterAmplify || 0),
    GRASS: Number(buffs.grassAmplify || 0),
    LIGHT: Number(buffs.lightAmplify || 0),
    DARK: Number(buffs.darkAmplify || 0),
  };
  let typeAmp = typeMap[spirit.type] || 0;

  // 정령 고유 타입 버프 (같은 속성 정령 전원 공유)
  if (spirit.buffType && spirit.buffType === spirit.type) {
    typeAmp += Number(spirit.buffValue || 0);
  }

  // 총 배율 = (1 + (공격% + 타입% + 공유버프) / 100)
  const totalMultiplier = 1 + (attackAmp + typeAmp + sharedBuff) / 100;

  // 최종공격력은 최종 배율 (예: 100%면 1배, 200%면 2배)
  const finalMultiplier = 1 + (Number(buffs.finalAttack || 0) / 100);

  // 최종 DPS 계산식
  const dps = base * totalMultiplier * finalMultiplier;

  return {
    dps,
    base,
    attackAmp,
    typeAmp,
    sharedBuff,
    totalMultiplier,
    finalMultiplier,
  };
}

/**
 * 전체 팀 DPS 계산 (5명 합산)
 */
export function calcTeamDPS(selectedSpirits, buffs) {
  // 배열이 아닐 경우 대비
  if (!Array.isArray(selectedSpirits)) {
    console.warn('⚠️ selectedSpirits is not an array:', selectedSpirits);
    return 0;
  }

  if (selectedSpirits.length === 0) return 0;

  let totalDPS = 0;
  selectedSpirits.forEach((spirit) => {
    if (spirit) {
      const { dps } = calcSpiritDPS(spirit, buffs);
      totalDPS += dps;
    }
  });
  return totalDPS;
}


/**
 * 보유 정령 중 최고 조합 5명을 선택하여 DPS 계산
 */
export function pickBestComboAndDPS(ownedSpirits, buffs) {
  if (!ownedSpirits || ownedSpirits.length === 0) return { bestCombo: [], bestDPS: 0 };

  // 각 정령별 DPS 계산 후 정렬
  const withDPS = ownedSpirits
    .map((spirit) => ({
      ...spirit,
      ...calcSpiritDPS(spirit, buffs),
    }))
    .sort((a, b) => b.dps - a.dps);

  // 상위 5명 선택
  const bestCombo = withDPS.slice(0, 5);
  const bestDPS = bestCombo.reduce((acc, s) => acc + s.dps, 0);

  return { bestCombo, bestDPS };
}
