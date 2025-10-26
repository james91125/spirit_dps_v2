// src/components/Step2Placement.jsx
import React from "react";
import spiritsData from "../data/spiritsData";
import { elementColors, gradeColors } from "../utils/colorMaps";

// 영어 buff_target_type → 한국어 변환 테이블
const buffTypeToKor = {
  element_fire: "불속성 정령",
  element_water: "물속성 정령",
  element_grass: "풀속성 정령",
  element_light: "빛속성 정령",
  element_dark: "어둠속성 정령",
  all: "모든 정령",
  character_attack: "공격력",
  character_defense: "방어력",
  character_hp: "체력",
  character_attack_speed: "공격 속도",
};

const Step2Placement = ({ selectedSpirits, setSelectedSpirits, setStep }) => {
  const handleSelect = (spirit) => {
    if (!spirit?.name) return;

    // 이미 선택된 경우 제거
    const exists = selectedSpirits.find((s) => s && s.name === spirit.name);
    if (exists) {
      setSelectedSpirits(selectedSpirits.filter((s) => s && s.name !== spirit.name));
    } else {
      // 새로 추가 (최대 5개)
      if (selectedSpirits.filter(Boolean).length < 5) {
        setSelectedSpirits([...selectedSpirits.filter(Boolean), spirit]);
      }
    }
  };

  // 💬 comment or buff_target_type 출력
  const getCommentText = (spirit) => {
    if (spirit.comment) return spirit.comment;
    if (spirit.buff_target_type && spirit.buff_value) {
      const targetKor = buffTypeToKor[spirit.buff_target_type] || spirit.buff_target_type;
      return `버프: ${targetKor} +${spirit.buff_value}%`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center py-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl flex flex-col h-[90vh]">
        <h1 className="text-3xl font-bold text-center pt-6 pb-4 border-b">
          정령 배치 선택
        </h1>

        {/* 카드 목록 (스크롤 가능) */}
        <div className="flex-1 overflow-y-scroll px-8 py-6">
          <div className="grid grid-cols-5 gap-4">
            {spiritsData.map((spirit, i) => {
              const isSelected = selectedSpirits.some(
                (s) => s && s.name === spirit.name
              );
              const commentText = getCommentText(spirit);

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(spirit)}
                  className={`border-2 rounded-lg p-4 cursor-pointer text-center transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-100"
                      : "border-gray-200 hover:border-indigo-400"
                  }`}
                >
                  <div
                    className={`font-semibold mb-1 ${
                      gradeColors[spirit.grade] || "text-gray-800"
                    }`}
                  >
                    {spirit.name}
                  </div>
                  <div
                    className={`text-xs mb-1 ${
                      elementColors[spirit.element_type] || "text-gray-600"
                    }`}
                  >
                    속성: {spirit.element_type || "—"}
                  </div>
                  <div className="text-xs text-gray-500">
                    등급: {spirit.grade}
                  </div>
                  <div className="text-xs text-gray-700 mt-1">
                    공격계수 {spirit.character_attack_coef}, 속도{" "}
                    {spirit.character_attack_speed}
                  </div>
                  {commentText && (
                    <div className="text-[11px] text-orange-600 mt-1">
                      💬 {commentText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 선택 영역 */}
        <div className="bg-gray-50 border-t px-8 py-4">
          <h2 className="font-bold text-lg mb-2">
            선택된 정령 ({selectedSpirits.filter(Boolean).length}/5)
          </h2>
          <div className="grid grid-cols-5 gap-3 mb-4">
            {[...Array(5)].map((_, i) => {
              const s = selectedSpirits[i];
              return (
                <div
                  key={i}
                  className={`border-2 rounded-lg p-3 text-center ${
                    s ? "border-indigo-300 bg-indigo-50" : "border-dashed border-gray-300"
                  }`}
                >
                  {s ? (
                    <>
                      <div className="font-semibold">{s.name}</div>
                      <div
                        className={`text-xs ${
                          elementColors[s.element_type] || "text-gray-500"
                        }`}
                      >
                        속성: {s.element_type}
                      </div>
                      <div
                        className={`text-xs ${
                          gradeColors[s.grade] || "text-gray-600"
                        }`}
                      >
                        등급: {s.grade}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 text-sm">+ 비어 있음</div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={selectedSpirits.filter(Boolean).length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            보유 정령 선택하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Placement;
