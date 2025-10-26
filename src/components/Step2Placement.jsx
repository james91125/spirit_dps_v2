import React from 'react';
import SpiritCard from './SpiritCard';
import SpiritSlot from './SpiritSlot';
import { elementColors, gradeColors } from '../utils/colorMaps';

import { SpiritGrade } from '../utils/constants';

const Step2Placement = ({
  spiritsData,
  selectedSpirits,
  setSelectedSpirits,
  setStep,
}) => {
  const handleSpiritSelect = (spirit) => {
    if (selectedSpirits.some((s) => s?.name === spirit.name)) return;
    const firstEmpty = selectedSpirits.findIndex((s) => s === null);
    if (firstEmpty === -1) return;
    const newSelected = [...selectedSpirits];
    newSelected[firstEmpty] = spirit;
    setSelectedSpirits(newSelected);
  };

  const handleRemoveSpirit = (index) => {
    const newSelected = [...selectedSpirits];
    newSelected[index] = null;
    setSelectedSpirits(newSelected);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">배치된 정령 선택</h1>

        {/* 전체 정령 목록 */}
        <div className="grid grid-cols-5 gap-3 bg-white p-4 rounded-lg shadow-lg mb-6 max-h-96 overflow-y-auto">
          {spiritsData.map((spirit, i) => (
            <SpiritCard
              key={i}
              spirit={spirit}
              isSelected={selectedSpirits.some((s) => s?.name === spirit.name)}
              onClick={() => handleSpiritSelect(spirit)}
            />
          ))}
        </div>

        {/* 선택된 정령 슬롯 */}
        <div className="bg-white rounded-lg p-6 shadow-xl mb-6">
          <h2 className="font-bold mb-4">
            선택된 정령 ({selectedSpirits.filter((s) => s).length}/5)
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {selectedSpirits.map((s, i) => (
              <SpiritSlot
                key={i}
                spirit={s}
                onRemove={() => s && handleRemoveSpirit(i)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!selectedSpirits.some((s) => s)}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          보유 정령 선택하기
        </button>
      </div>
    </div>
  );
};

export default Step2Placement;
