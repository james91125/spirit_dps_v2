import React, { useState } from 'react';
import { normalizeGrade } from '../utils/colorMaps';

const GRADES = [
  'NORMAL', 'MAGIC', 'RARE', 'UNIQUE', 'EPIC', 'LEGENDARY',
  'DIVINE', 'MYSTIC', 'ETERNAL', 'INFINITY', 'ELDER', 
//   'AKASHIC', 'EMPYREAN'
];

export default function GradeSelectBar({
  onSelectByGradeToggle,  // (grade, kind, add)
  onClearAll,
  onSelectAll,
  title,
  kind                   // 'spirit' | 'skill'
}) {
  const [activeGrades, setActiveGrades] = useState(new Set());

  // 개별 등급 토글
  const handleGradeClick = (grade) => {
    const normalized = normalizeGrade(grade);
    const newActive = new Set(activeGrades);
    const isActive = newActive.has(normalized);

    if (isActive) newActive.delete(normalized);
    else newActive.add(normalized);

    setActiveGrades(newActive);
    onSelectByGradeToggle(normalized, kind, !isActive);
  };

  const handleSelectAll = () => {
    const allGrades = new Set(GRADES.map((g) => normalizeGrade(g)));
    setActiveGrades(allGrades);
    // 모든 등급을 한 번에 전달
    onSelectAll(kind, Array.from(allGrades));
  };

  const handleClearAll = () => {
    setActiveGrades(new Set());
    onClearAll(kind);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center mb-3">
      <strong className="mr-2 text-sm sm:text-base">{title}</strong>

      {GRADES.map((g) => {
        const normalized = normalizeGrade(g);
        const isActive = activeGrades.has(normalized);
        return (
          <button
            key={g}
            onClick={() => handleGradeClick(g)}
            className={`border rounded-md px-2 py-1 cursor-pointer text-xs sm:text-sm font-semibold select-none ${
              isActive ? 'border-blue-600 bg-blue-100' : 'border-gray-300 bg-white'
            }`}
          >
            {g}
          </button>
        );
      })}

      <button
        onClick={handleSelectAll}
        className="bg-blue-600 text-white border-none rounded-md px-3 py-1 cursor-pointer font-semibold text-xs sm:text-sm ml-2"
      >
        전체 선택
      </button>

      <button
        onClick={handleClearAll}
        className="bg-red-500 text-white border-none rounded-md px-3 py-1 cursor-pointer font-semibold text-xs sm:text-sm ml-1"
      >
        전체 해제
      </button>
    </div>
  );
}
