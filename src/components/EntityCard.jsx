// src/components/EntityCard.jsx
import React from 'react';
import { assetUrl } from '../utils/imagePath';
import { colorOfGrade, colorOfElement } from '../utils/colorMaps';

export default function EntityCard({ type, data, selected, onToggle, index }) {
  const gradeColor = colorOfGrade(data.grade);
  const elColor = data.element_type ? colorOfElement(data.element_type) : '#e0e0e0';
  const src = assetUrl(type === 'spirit' ? 'spirits' : 'skill', data.image);

  const border = selected ? `2px solid ${gradeColor}` : '1px solid #ddd';

  return (
    <div
      key={`${type}-${data.name}-${index}`}
      onClick={onToggle}
      style={{
        width: 220,
        padding: 12,
        border,
        borderRadius: 12,
        cursor: 'pointer',
        background: selected ? '#fafafa' : '#fff',
        boxShadow: selected ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: '0.15s',
      }}
    >
      <strong style={{ color: gradeColor }}>{data.name}</strong>
      <img
        src={src}
        alt={data.name}
        style={{
          width: 90,
          height: 90,
          margin: '8px 0',
          objectFit: 'contain',
          borderRadius: 8,
          border: '1px solid #eee',
          background: '#fff',
        }}
      />

      {type === 'spirit' ? (
        <div style={{ fontSize: 12, color: '#333', textAlign: 'center' }}>
          속성: <span style={{ color: elColor }}>{data.element_type ?? '-'}</span><br />
          등급: <span style={{ color: gradeColor }}>{data.grade}</span><br />
          공격력 계수: {data['공격력 계수'] ?? 0}, 공격속도: {data['공격속도'] ?? 0}<br />
          <span style={{ color: '#4caf50' }}>버프:</span> {data.comment}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: '#333', textAlign: 'center' }}>
          등급: <span style={{ color: gradeColor }}>{data.grade}</span><br />
          데미지: {data.damagePercent ?? 0}% × {data.hitCount ?? 1}<br />
          쿨타임: {data.cooltime ?? 0}s
        </div>
      )}
    </div>
  );
}
