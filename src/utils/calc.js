// src/utils/calc.js
// 숫자 안전 변환
const num = (v, def = 0) => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
  return Number.isFinite(n) ? n : def;
};

// 정령 DPS: 공격계수 * 공격속도 (간단 모델)
export function spiritDps(spirit) {
  const atkCoef = num(spirit['공격력 계수']);
  const atkSpd = num(spirit['공격속도'], 1);
  return atkCoef * atkSpd;
}

// 스킬 DPS: (데미지% * 타격수 / 100) / 쿨타임
export function skillDps(skill) {
  const dmgPct = num(skill.damagePercent);
  const hits = num(skill.hitCount, 1);
  const ct = Math.max(num(skill.cooltime, 1), 0.0001);
  return (dmgPct * hits / 100) / ct;
}

// 상위 N 추출(필터/보유여부 적용)
export function topN(arr, n, scoreFn, filterFn = () => true) {
  return [...arr]
    .filter(filterFn)
    .map(item => ({ item, score: scoreFn(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(x => x.item);
}

// 선택된 목록의 총합
export function sumDps(spirits, skills) {
  const s = spirits.reduce((acc, it) => acc + spiritDps(it), 0);
  const k = skills.reduce((acc, it) => acc + skillDps(it), 0);
  return s + k;
}
