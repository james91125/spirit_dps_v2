// src/utils/calculateDPS.js
export function calcSpiritDPS(spirit, buffs) {
  // 기본 값
  const base = Number(spirit.attackCoef) * Number(spirit.attackSpeed);

  // 공격력 증폭
  let attackAmp =
    Number(buffs.attackAmplify || 0) +
    Number(buffs.spiritAttackAmplify || 0) +
    (spirit.buffType === 'attack' ? Number(spirit.buffValue || 0) : 0);

  // 속성 증폭
  const typeMap = {
    FIRE: Number(buffs.fireAmplify || 0),
    WATER: Number(buffs.waterAmplify || 0),
    GRASS: Number(buffs.grassAmplify || 0),
    LIGHT: Number(buffs.lightAmplify || 0),
    DARK: Number(buffs.darkAmplify || 0),
  };
  let typeAmp = typeMap[spirit.type] || 0;

  // 정령 자체 타입 버프
  if (
    spirit.buffType &&
    spirit.buffType !== 'attack' &&
    spirit.buffType === spirit.type
  ) {
    typeAmp += Number(spirit.buffValue || 0);
  }

  const totalAmpPercent = attackAmp + typeAmp;

  // 최종 DPS
  const dps = base * (1 + totalAmpPercent / 100);

  return {
    dps,
    base,
    attackAmp,
    typeAmp,
    totalAmpPercent,
  };
}
