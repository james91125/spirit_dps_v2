import React from 'react';
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
  kind,                   // 'spirit' | 'skill'
  activeGrades,           // Set of active grades from parent
  isAllSelected           // Boolean from parent
}) {

  // 개별 등급 토글
  const handleGradeClick = (grade) => {
    const normalized = normalizeGrade(grade);
    const isActive = activeGrades.has(normalized);
    onSelectByGradeToggle(normalized, kind, !isActive);
  };

  const handleSelectAll = () => {
    const allGrades = GRADES.map((g) => normalizeGrade(g));
    onSelectAll(kind, allGrades);
  };

  const handleClearAll = () => {
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
            className={`border rounded-md px-2 py-1 cursor-pointer text-xs sm:text-sm font-semibold select-none transition-colors ${
              isActive ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white hover:bg-gray-100'
            }`}
          >
            {g}
          </button>
        );
      })}

      <button
        onClick={handleSelectAll}
        className={`border-none rounded-md px-3 py-1 cursor-pointer font-semibold text-xs sm:text-sm ml-2 transition-colors ${
          isAllSelected ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        전체 선택
      </button>

      <button
        onClick={handleClearAll}
        className="bg-red-500 text-white border-none rounded-md px-3 py-1 cursor-pointer font-semibold text-xs sm:text-sm ml-1 hover:bg-red-600 transition-colors"
      >
        전체 해제
      </button>
    </div>
  );
}
