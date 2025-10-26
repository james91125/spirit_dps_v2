import React from 'react';
import { X } from 'lucide-react';
import { SpiritGrade } from '../utils/constants';

const SpiritSlot = ({ spirit, onRemove }) => {
  return (
    <div
      onClick={onRemove}
      className={`border-2 rounded-lg p-4 text-center ${
        spirit
          ? 'cursor-pointer hover:bg-red-50 border-gray-300 bg-white'
          : 'border-dashed border-gray-300 bg-gray-50'
      }`}
    >
      {spirit ? (
        <div>
          <div className="font-semibold text-sm">{spirit.name}</div>
          <div className="text-xs text-gray-500 mt-1">{SpiritGrade[spirit.grade]}</div>
          <X className="w-4 h-4 mx-auto mt-1 text-gray-400" />
        </div>
      ) : (
        <div className="text-gray-400 text-sm">빈 슬롯</div>
      )}
    </div>
  );
};

export default SpiritSlot;
