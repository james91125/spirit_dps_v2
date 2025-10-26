// ✅ src/components/Step4Result.jsx
import React from "react";
import { SpiritGrade } from "../utils/constants";
import { elementColors, gradeColors } from "../utils/colorMaps";

const Step4Result = ({ result, setStep, setOwnedSpirits, setSelectedSpirits, setResult }) => {
  if (!result) return null;

  const getGradeColor = (grade) => gradeColors[grade] || "text-gray-600";
  const getElementColor = (element) => elementColors[element] || "text-gray-600";

  const formatDPS = (val) => (val ? Number(val).toFixed(2) : "0.00");

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">계산 결과</h1>

        {/* 상단 요약 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-lg text-gray-700 mb-2">현재 배치 DPS</div>
            <div className="text-4xl font-bold text-indigo-700">
              {formatDPS(result.totalDPS)}
            </div>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-lg text-gray-700 mb-2">최적 조합 DPS</div>
            <div className="text-4xl font-bold text-green-600">
              {formatDPS(result.bestDPS)}
            </div>
          </div>
        </div>

        {/* DPS 차이 */}
        <div className="text-center mb-8 p-4 bg-yellow-50 rounded-lg">
          <div className="text-lg text-gray-700">DPS 차이</div>
          <div
            className={`text-3xl font-bold ${
              parseFloat(result.difference) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {parseFloat(result.difference) >= 0 ? "+" : ""}
            {formatDPS(result.difference)}
          </div>
        </div>

        {/* 현재 배치 정령 */}
        <h2 className="font-bold text-xl mb-4 text-indigo-900">현재 배치 정령</h2>
        <div className="grid grid-cols-5 gap-3 mb-8">
          {result.details.map((s, i) => (
            <div
              key={i}
              className={`border-2 border-indigo-200 rounded-lg p-4 text-center bg-indigo-50 shadow-sm hover:shadow-md transition`}
            >
              <div className={`font-semibold text-base mb-1 ${getGradeColor(s.grade)}`}>
                {s.name}
              </div>
              <div className={`text-xs mb-1 ${getElementColor(s.element_type)}`}>
                속성: {s.element_type || "N/A"}
              </div>
              <div className={`text-xs mb-1 ${getGradeColor(s.grade)}`}>
                등급: {SpiritGrade[s.grade] || s.grade || "—"}
              </div>
              <div className="text-xs text-green-700 mt-2 font-bold">
                DPS: {formatDPS(s.dps)}
              </div>
            </div>
          ))}
        </div>

        {/* 최적 조합 정령 */}
        <h2 className="font-bold text-xl mb-4 text-green-900">최적 조합 정령</h2>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {result.bestCombo.map((s, i) => (
            <div
              key={i}
              className={`border-2 border-green-200 rounded-lg p-4 text-center bg-green-50 shadow-sm hover:shadow-md transition`}
            >
              <div className={`font-semibold text-base mb-1 ${getGradeColor(s.grade)}`}>
                {s.name}
              </div>
              <div className={`text-xs mb-1 ${getElementColor(s.element_type)}`}>
                속성: {s.element_type || "N/A"}
              </div>
              <div className={`text-xs mb-1 ${getGradeColor(s.grade)}`}>
                등급: {SpiritGrade[s.grade] || s.grade || "—"}
              </div>
              <div className="text-xs text-green-700 mt-2 font-bold">
                DPS: {formatDPS(s.dps)}
              </div>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <button
          onClick={() => {
            setStep(1);
            setSelectedSpirits([null, null, null, null, null]);
            setOwnedSpirits([]);
            setResult(null);
          }}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-bold"
        >
          처음으로
        </button>
      </div>
    </div>
  );
};

export default Step4Result;
