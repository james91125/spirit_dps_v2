// src/components/EntityCard.jsx
import React from 'react';
import { assetUrl } from '../utils/imagePath';
import { colorOfGrade, colorOfElement } from '../utils/colorMaps';

export default function EntityCard({ type, data, selected, onToggle, index }) {
  const gradeColor = colorOfGrade(data.grade);
  const elColor = data.element_type ? colorOfElement(data.element_type) : '#e0e0e0';
  const src = assetUrl(type === 'spirit' ? 'spirits' : 'skill', data.image);

  const borderStyle = selected ? { borderColor: gradeColor, borderWidth: '2px' } : { borderColor: '#ddd', borderWidth: '1px' };

  return (
    <div
      key={`${type}-${data.name}-${index}`}
      onClick={onToggle}
      className={`w-full p-3 rounded-xl cursor-pointer flex flex-col items-center transition-all duration-150 ${
        selected ? 'bg-gray-50 shadow-lg' : 'bg-white shadow-md'
      }`}
      style={borderStyle}
    >
      <strong style={{ color: gradeColor }} className="text-center">{data.name}</strong>
      <img
        src={src}
        alt={data.name}
        className="w-20 h-20 sm:w-24 sm:h-24 my-2 object-contain rounded-lg border border-gray-200 bg-white"
      />

      {type === 'spirit' ? (
        <div className="text-xs text-gray-800 text-center">
          속성: <span style={{ color: elColor }}>{data.element_type ?? '-'}</span><br />
          등급: <span style={{ color: gradeColor }}>{data.grade}</span><br />
          공격력 계수: {data['공격력 계수'] ?? 0}, 공격속도: {data['공격속도'] ?? 0}<br />
          <span className="text-green-600">버프:</span> {data.comment}
        </div>
      ) : (
        <div className="text-xs text-gray-800 text-center">
          등급: <span style={{ color: gradeColor }}>{data.grade}</span><br />
          데미지: {data.damagePercent ?? 0}% × {data.hitCount ?? 1}<br />
          쿨타임: {data.cooltime ?? 0}s
        </div>
      )}
    </div>
  );
}
