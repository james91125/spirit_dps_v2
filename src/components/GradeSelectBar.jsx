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
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      }}
    >
      <strong style={{ marginRight: 10 }}>{title}</strong>

      {GRADES.map((g) => {
        const normalized = normalizeGrade(g);
        const isActive = activeGrades.has(normalized);
        return (
          <button
            key={g}
            onClick={() => handleGradeClick(g)}
            style={{
              border: isActive ? '2px solid #1976d2' : '1px solid #ccc',
              background: isActive ? '#e3f2fd' : '#fff',
              borderRadius: 6,
              padding: '3px 8px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              userSelect: 'none',
            }}
          >
            {g}
          </button>
        );
      })}

      {/* ✅ 전체 선택 / 해제 버튼 */}
      <button
        onClick={handleSelectAll}
        style={{
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '4px 10px',
          cursor: 'pointer',
          fontWeight: 600,
          marginLeft: 8,
        }}
      >
        전체 선택
      </button>

      <button
        onClick={handleClearAll}
        style={{
          background: '#ef5350',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '4px 10px',
          cursor: 'pointer',
          fontWeight: 600,
          marginLeft: 4,
        }}
      >
        전체 해제
      </button>
    </div>
  );
}
