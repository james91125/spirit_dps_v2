// src/utils/colorMaps.js
// ---------------------------------------------------
// 등급 색상, 속성 색상, normalizeGrade 매핑 확장
// ---------------------------------------------------

export const gradeColors = {
  NORMAL: '#9e9e9e',
  MAGIC: '#5c6bc0',
  RARE: '#26a69a',
  UNIQUE: '#7cb342',
  EPIC: '#ab47bc',
  LEGENDARY: '#ff9800',
  DIVINE: '#00acc1',
  MYSTIC: '#c62828',
  ETERNAL: '#455a64',
  INFINITY: '#6d4c41',
  ELDER: '#1e88e5',
  AKASHIC: '#8e24aa',
  EMPYREAN: '#3949ab',
};

export const elementColors = {
  FIRE: '#ef5350',
  WATER: '#42a5f5',
  GRASS: '#66bb6a',
  LIGHT: '#ffd54f',
  DARK: '#8d6e63',
  NEUTRAL: '#bdbdbd',
};

// 영어/한글 등급 매핑
export function normalizeGrade(raw) {
  if (!raw) return '';

  const str = String(raw).trim().toUpperCase();

  // 1️⃣ 영어 직접 매칭
  if (gradeColors[str]) return str;

  // 2️⃣ 한글 → 영어 매핑 (포함되는 단어로 체크)
  if (str.includes('노멀')) return 'NORMAL';
  if (str.includes('매직')) return 'MAGIC';
  if (str.includes('희귀')) return 'RARE';
  if (str.includes('독특한')) return 'UNIQUE';
  if (str.includes('에픽')) return 'EPIC';
  if (str.includes('전설')) return 'LEGENDARY';
  if (str.includes('디바인')) return 'DIVINE';
  if (str.includes('미스틱')) return 'MYSTIC';
  if (str.includes('이터널')) return 'ETERNAL';
  if (str.includes('인피니티')) return 'INFINITY';
  if (str.includes('엘더')) return 'ELDER';
  if (str.includes('아카식')) return 'AKASHIC';
  if (str.includes('엠피리언')) return 'EMPYREAN';
  if (str.includes('엠피리안')) return 'EMPYREAN';

  return str;
}

export function colorOfGrade(grade) {
  const g = normalizeGrade(grade);
  return gradeColors[g] ?? '#bdbdbd';
}

export function colorOfElement(el) {
  return elementColors[el?.toUpperCase()] ?? '#bdbdbd';
}
