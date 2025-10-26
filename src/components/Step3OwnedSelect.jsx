import React from 'react';
import SpiritCard from './SpiritCard';
import { SpiritGrade } from '../utils/constants';
import { elementColors, gradeColors } from '../utils/colorMaps';


const Step3OwnedSelect = ({ spiritsData, ownedSpirits, setOwnedSpirits, calculateResult }) => {
  const handleOwnedSpiritToggle = (spirit) => {
    if (ownedSpirits.find((s) => s.name === spirit.name)) {
      setOwnedSpirits(ownedSpirits.filter((s) => s.name !== spirit.name));
    } else {
      setOwnedSpirits([...ownedSpirits, spirit]);
    }
  };

  const selectByGrade = (gradeKey) => {
    const sameGrade = spiritsData.filter((s) => s.grade === gradeKey);
    setOwnedSpirits((prev) => {
      const merged = [
        ...prev,
        ...sameGrade.filter((s) => !prev.some((p) => p.name === s.name)),
      ];
      return merged.slice(0, spiritsData.length);
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">보유 정령 선택</h1>

        {/* 등급별 전체 선택 */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {Object.keys(SpiritGrade).map((gradeKey) => (
            <button
              key={gradeKey}
              onClick={() => selectByGrade(gradeKey)}
              className="bg-white border px-3 py-1 rounded-lg text-sm font-semibold shadow hover:bg-green-50 transition"
            >
              {SpiritGrade[gradeKey]} 전체 선택
            </button>
          ))}
          <button
            onClick={() => setOwnedSpirits([])}
            className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
          >
            전체 해제
          </button>
        </div>

        {/* 전체 정령 목록 */}
        <div className="grid grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow-lg mb-6 max-h-96 overflow-y-auto">
          {spiritsData.map((spirit, i) => {
            const isOwned = ownedSpirits.find((s) => s.name === spirit.name);
            return (
              <SpiritCard
                key={i}
                spirit={spirit}
                isSelected={isOwned}
                onClick={() => handleOwnedSpiritToggle(spirit)}
              />
            );
          })}
        </div>

        {/* 보유 정령 목록 */}
        <div className="bg-white rounded-lg p-6 shadow-xl mb-6">
          <h2 className="font-bold mb-2">
            보유 정령 목록 ({ownedSpirits.length}/{spiritsData.length})
          </h2>
          <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
            {ownedSpirits.map((s, i) => (
              <div
                key={i}
                className="border rounded-lg text-center p-2 text-xs bg-gray-50"
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={calculateResult}
          disabled={ownedSpirits.length === 0}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          결과 보기
        </button>
      </div>
    </div>
  );
};

export default Step3OwnedSelect;
