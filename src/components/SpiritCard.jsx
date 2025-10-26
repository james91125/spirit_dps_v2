import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getTypeColor, getGradeColor } from '../utils/colorMaps';
import { SpiritGrade, SpiritType } from '../utils/constants';

const SpiritCard = ({ spirit, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border-4 ${getGradeColor(spirit.grade)} rounded-lg p-2 cursor-pointer hover:shadow-lg relative ${
        isSelected ? 'bg-green-50 opacity-70' : 'bg-white'
      }`}
    >
      {isSelected && (
        <div className="absolute top-1 right-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
        </div>
      )}
      <div className="text-sm font-bold text-center">{spirit.name}</div>
      <div
        className={`${getTypeColor(spirit.type)} text-white text-center py-1 rounded text-xs mt-1`}
      >
        {SpiritType[spirit.type]}
      </div>
      <div className="text-xs text-gray-500 text-center mt-1">{SpiritGrade[spirit.grade]}</div>
    </div>
  );
};

export default SpiritCard;
