import React from 'react';
import { elementColors, gradeColors } from '../utils/colorMaps';

const SpiritCard = ({ spirit, onClick, isSelected }) => {
  if (!spirit) return null;

  return (
    <div
      onClick={onClick}
      className={`border-2 p-3 rounded-lg cursor-pointer transition 
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-indigo-300'}
      `}
    >
      {/* 이름 및 등급 색상 */}
      <div className={`font-bold ${gradeColors[spirit.grade] || 'text-gray-800'}`}>
        {spirit.name}
      </div>

      {/* 타입 색상 */}
      <div className={`text-xs ${elementColors[spirit.type] || 'text-gray-600'} mt-1`}>
        {spirit.type}
      </div>

      {/* 기본 수치 */}
      <div className="text-xs text-gray-500 mt-1">
        공격력계수 {spirit.character_attack_coef || spirit.attackCoef}, 속도 {spirit.character_attack_speed || spirit.attackSpeed}
      </div>

      {/* 코멘트 표시 */}
      {spirit.comment && (
        <div className="text-[11px] text-amber-600 mt-2 italic">
          💬 {spirit.comment}
        </div>
      )}
    </div>
  );
};

export default SpiritCard;
