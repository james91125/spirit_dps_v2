import React from 'react';
import { spiritDps, skillDps, sumDps, topN } from '../utils/calc';
import { colorOfGrade } from '../utils/colorMaps';
import { assetUrl } from '../utils/imagePath';

export default function Step4Result({ ownedSpirits, ownedSkills }) {
  const topSpirits = topN(ownedSpirits, 5, spiritDps);
  const topSkills = topN(ownedSkills, 5, skillDps);
  const total = sumDps(topSpirits, topSkills);

  const renderList = (list, type, calcFn) =>
    list.map((it, idx) => {
      const gradeColor = colorOfGrade(it.grade);
      const src = assetUrl(type === 'spirit' ? 'spirits' : 'skill', it.image);
      const dps = calcFn(it).toFixed(2);
      return (
        <div
          key={`${type}-${it.name}-${idx}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            border: '1px solid #ddd',
            borderRadius: 10,
            padding: 8,
            background: '#fff',
          }}
        >
          <img
            src={src}
            alt={it.name}
            style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'contain' }}
          />
          <div style={{ flex: 1 }}>
            <strong style={{ color: gradeColor }}>{it.name}</strong>
            <div style={{ fontSize: 12, color: '#555' }}>
              {type === 'spirit'
                ? `속성: ${it.element_type} | 계수 ${it.character_attack_coef} × 속도 ${it.character_attack_speed}`
                : `데미지 ${it.damagePercent}% × ${it.hitCount} | 쿨 ${it.cooltime}s`}
            </div>
          </div>
          <div style={{ fontWeight: 700, color: gradeColor }}>{dps}</div>
        </div>
      );
    });

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>STEP 4 — 결과 요약</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3 style={{ borderBottom: '2px solid #ccc' }}>정령 TOP 5</h3>
          {renderList(topSpirits, 'spirit', spiritDps)}
        </div>
        <div>
          <h3 style={{ borderBottom: '2px solid #ccc' }}>스킬 TOP 5</h3>
          {renderList(topSkills, 'skill', skillDps)}
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: 30,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1e88e5',
        }}
      >
        총합 DPS: {total.toFixed(2)}
      </div>
    </div>
  );
}
