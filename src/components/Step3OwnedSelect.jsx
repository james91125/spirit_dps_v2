// src/components/Step3OwnedSelect.jsx
import React from 'react';
import { elementColors, gradeColors } from '../utils/colorMaps';

// 영어 buff_target_type → 한국어 변환 테이블
const buffTypeToKor = {
  element_fire: '불속성 정령',
  element_water: '물속성 정령',
  element_grass: '풀속성 정령',
  element_light: '빛속성 정령',
  element_dark: '어둠속성 정령',
  all: '모든 정령',
  character_attack: '공격력',
  character_defense: '방어력',
  character_hp: '체력',
  character_attack_speed: '공격 속도',
};

const Step3OwnedSelect = ({ spiritsData, ownedSpirits, setOwnedSpirits, calculateResult }) => {
  // 등급 목록 자동 생성
  const gradeList = [...new Set(spiritsData.map((s) => s.grade))];

  /** 개별 토글 */
  const handleOwnedSpiritToggle = (spirit) => {
    setOwnedSpirits((prev) => {
      const exists = prev.some((s) => s.name === spirit.name);
      return exists
        ? prev.filter((s) => s.name !== spirit.name)
        : [...prev, spirit];
    });
  };

  /** 등급별 전체 선택/해제 */
  const selectByGrade = (gradeName) => {
    const sameGrade = spiritsData.filter((s) => s.grade === gradeName);
    setOwnedSpirits((prev) => {
      const allSelected = sameGrade.every((sg) =>
        prev.some((p) => p.name === sg.name)
      );
      if (allSelected) {
        return prev.filter((p) => p.grade !== gradeName);
      } else {
        const newList = [
          ...prev,
          ...sameGrade.filter((sg) => !prev.some((p) => p.name === sg.name)),
        ];
        return newList;
      }
    });
  };

  /** 버프/코멘트 표시 로직 */
  const getCommentText = (spirit) => {
    if (spirit.comment) return spirit.comment; // ① comment 우선 표시
    if (spirit.buff_target_type && spirit.buff_value) {
      const targetKor = buffTypeToKor[spirit.buff_target_type] || spirit.buff_target_type;
      return `버프: ${targetKor} +${spirit.buff_value}%`; // ② 한국어 변환
    }
    return null;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">보유 정령 선택</h1>

        {/* 등급별 전체 선택 */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {gradeList.map((gradeName) => (
            <button
              key={gradeName}
              onClick={() => selectByGrade(gradeName)}
              className={`bg-white border px-3 py-1 rounded-lg text-sm font-semibold shadow hover:bg-green-50 transition ${
                gradeColors[gradeName] || 'text-gray-700'
              }`}
            >
              {gradeName} 전체 선택
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
            const isOwned = ownedSpirits.some((s) => s.name === spirit.name);
            const commentText = getCommentText(spirit);

            return (
              <div
                key={i}
                onClick={() => handleOwnedSpiritToggle(spirit)}
                className={`cursor-pointer border-2 rounded-lg p-4 transition ${
                  isOwned
                    ? 'bg-green-100 border-green-400'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold mb-1">{spirit.name}</div>

                {/* 속성 */}
                <div className={`text-xs ${elementColors[spirit.element_type]}`}>
                  속성: {spirit.element_type}
                </div>

                {/* 등급 */}
                <div className={`text-xs ${gradeColors[spirit.grade]}`}>
                  등급: {spirit.grade}
                </div>

                {/* 버프/코멘트 */}
                {commentText && (
                  <div className="text-xs text-gray-600 mt-1">
                    💬 {commentText}
                  </div>
                )}
              </div>
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

        {/* 결과 버튼 */}
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
