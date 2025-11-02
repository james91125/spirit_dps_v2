// src/components/Step3OwnedStats.jsx
import React, { useMemo } from 'react';
import EntityCard from './EntityCard';
import GradeSelectBar from './GradeSelectBar';
import { normalizeGrade } from '../utils/colorMaps';

export default function Step3OwnedStats({ skillData, ownedSkills, setOwnedSkills, calculateResult, goPrev }) {
  const ownedKeys = useMemo(() => new Set(ownedSkills.map((s) => s.id ?? s.name)), [ownedSkills]);

  const toggleOwned = (sk) => {
    const key = sk.id ?? sk.name;
    setOwnedSkills((prev) =>
      ownedKeys.has(key) ? prev.filter((x) => (x.id ?? x.name) !== key) : [...prev, sk]
    );
  };

  const onSelectByGradeToggle = (gradeStd, kind, add) => {
    if (kind !== 'skill') return;
    setOwnedSkills((prev) => {
      const sameGrade = skillData.filter((s) => normalizeGrade(s.grade) === gradeStd);
      if (add) {
        const ids = new Set(prev.map((s) => s.id ?? s.name));
        const merged = [...prev, ...sameGrade.filter((s) => !ids.has(s.id ?? s.name))];
        return merged;
      } else {
        return prev.filter((s) => normalizeGrade(s.grade) !== gradeStd);
      }
    });
  };

  const onSelectAll = (kind, allGrades) => {
    if (kind !== 'skill') return;
    setOwnedSkills((prev) => {
      const ids = new Set(prev.map((s) => s.id ?? s.name));
      const toAdd = skillData.filter(
        (s) => allGrades.includes(normalizeGrade(s.grade)) && !ids.has(s.id ?? s.name)
      );
      return [...prev, ...toAdd];
    });
  };

  const onClearAll = () => setOwnedSkills([]);

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>STEP 3 — 스킬 선택</h2>

      <GradeSelectBar
        title="스킬 등급 선택"
        kind="skill"
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
          {skillData.map((sk, i) => (
            <EntityCard
              key={`${sk.name}-${i}`}
              type="skill"
              data={sk}
              selected={ownedKeys.has(sk.id ?? sk.name)}
              onToggle={() => toggleOwned(sk)}
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
          onClick={calculateResult}
          style={{
            background: '#43a047',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          결과 확인 (DPS 계산)
        </button>
      </div>
    </div>
  );
}
