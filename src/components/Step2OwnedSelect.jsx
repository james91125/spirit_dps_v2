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
    <div className="p-4 flex flex-col min-h-screen h-screen">
      <h2 className="text-center font-bold text-xl sm:text-2xl">STEP 2 — 정령 선택</h2>

      <GradeSelectBar
        title="정령 등급 선택"
        kind="spirit"
        onSelectByGradeToggle={onSelectByGradeToggle}
        onClearAll={onClearAll}
        onSelectAll={onSelectAll}
      />

      <div className="flex-1 overflow-y-auto p-2 sm:p-3 border border-gray-200 rounded-lg bg-white mt-3 shadow-inner max-h-[calc(100vh-250px)]">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
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

      <div className="text-center mt-4 flex justify-center gap-4">
        <button
          onClick={goPrev}
          className="bg-gray-500 text-white border-none px-4 py-2 rounded-lg cursor-pointer font-semibold"
        >
          ← 이전 단계
        </button>
        <button
          onClick={goNext}
          className="bg-blue-600 text-white border-none px-4 py-2 rounded-lg cursor-pointer font-semibold"
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  );
}
