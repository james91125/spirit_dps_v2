// src/components/Step2OwnedSelect.jsx
import React, { useMemo } from 'react';
import EntityCard from './EntityCard';
import GradeSelectBar from './GradeSelectBar';
import { normalizeGrade } from '../utils/colorMaps';

export default function Step2OwnedSelect({ spiritsData, ownedSpirits, setOwnedSpirits, goNext, goPrev }) {
  const ownedKeys = useMemo(() => new Set(ownedSpirits.map((s) => s.id ?? s.name)), [ownedSpirits]);

  const toggleOwned = (sp) => {
    const key = sp.id ?? sp.name;
    setOwnedSpirits((prev) =>
      ownedKeys.has(key) ? prev.filter((x) => (x.id ?? x.name) !== key) : [...prev, sp]
    );
  };

  const onSelectByGradeToggle = (gradeStd, kind, add) => {
    if (kind !== 'spirit') return;
    setOwnedSpirits((prev) => {
      const sameGrade = spiritsData.filter((s) => normalizeGrade(s.grade) === gradeStd);
      if (add) {
        // ✅ 중복 방지
        const ids = new Set(prev.map((s) => s.id ?? s.name));
        const merged = [...prev, ...sameGrade.filter((s) => !ids.has(s.id ?? s.name))];
        return merged;
      } else {
        return prev.filter((s) => normalizeGrade(s.grade) !== gradeStd);
      }
    });
  };

  const onSelectAll = (kind, allGrades) => {
    if (kind !== 'spirit') return;
    setOwnedSpirits((prev) => {
      const ids = new Set(prev.map((s) => s.id ?? s.name));
      const toAdd = spiritsData.filter(
        (s) => allGrades.includes(normalizeGrade(s.grade)) && !ids.has(s.id ?? s.name)
      );
      return [...prev, ...toAdd];
    });
  };

  const onClearAll = () => setOwnedSpirits([]);

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>STEP 2 — 정령 선택</h2>

      <GradeSelectBar
        title="정령 등급 선택"
        kind="spirit"
        onSelectByGradeToggle={onSelectByGradeToggle}
        onClearAll={onClearAll}
        onSelectAll={onSelectAll}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
          border: '1px solid #eee',
          borderRadius: 8,
          background: '#fff',
          marginTop: 10,
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 18,
          }}
        >
          {spiritsData.map((sp, i) => (
            <EntityCard
              key={`${sp.name}-${i}`}
              type="spirit"
              data={sp}
              selected={ownedKeys.has(sp.id ?? sp.name)}
              onToggle={() => toggleOwned(sp)}
            />
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', justifyContent: 'center', gap: 10 }}>
        <button
          onClick={goPrev}
          style={{
            background: '#9e9e9e',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          ← 이전 단계
        </button>
        <button
          onClick={goNext}
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  );
}
