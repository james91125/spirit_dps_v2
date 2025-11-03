export const num = (v, def = 0) => {
  const n = typeof v === 'string' ? Number(v.replace(/,/g, '.')) : Number(v);
  return Number.isFinite(n) ? n : def;
};

export const ELEMENT_MAP = {
  '불': 'fire', '물': 'water', '풀': 'grass', '빛': 'light', '어둠': 'dark'
};

export const SIM_TIMES = [30, 40, 60];

export const gradeOrder = {
    "아카식": 13, "엠피리언": 12, "엘더": 11, "인피니티": 10, "이터널": 9,
    "미스틱": 8, "디바인": 7, "레전더리": 6, "에픽": 5, "유니크": 4,
    "레어": 3, "매직": 2, "노말": 1
};