import React, { useState } from "react";
import { SpiritGrade } from "../utils/constants";
import { elementColors, gradeColors } from "../utils/colorMaps";
import { SIM_TIMES } from "../utils/calculateDPS";
import { assetUrl } from "../utils/imagePath"; // 이미지 경로 유틸리티 임포트

const Step4Result = ({ result, setStep, handleReset }) => {
  const [activeTime, setActiveTime] = useState(SIM_TIMES[SIM_TIMES.length - 1]);

  if (!result) return null;

  const getGradeColor = (grade) => gradeColors[grade] || "text-gray-600";
  const getElementColor = (element) => elementColors[element] || "text-gray-600";

  const formatDPS = (val) => (val ? Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00");
  const formatPercent = (val) => (val ? Number(val).toFixed(2) : "0.00");

  const currentDPS = result.currentDPS[activeTime];
  const finalBestDPS = result.bestDPS[activeTime];

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-indigo-900">최적 배치 계산 결과</h1>

        {/* 시간 선택 탭 */}
        <div className="flex justify-center items-center mb-6 bg-gray-100 rounded-full p-1 shadow-inner">
          {SIM_TIMES.map(time => (
            <button
              key={time}
              onClick={() => setActiveTime(time)}
              className={`px-6 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                activeTime === time
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              {time}초 기준
            </button>
          ))}
        </div>

        {/* 상단 요약 */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg shadow-inner">
            <div className="text-lg text-gray-700 mb-2">현재 배치 DPS</div>
            <div className="text-4xl font-bold text-indigo-700">
              {formatDPS(currentDPS)}
            </div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg shadow-inner">
            <div className="text-lg text-gray-700 mb-2">최적 조합 DPS</div>
            <div className="text-4xl font-bold text-green-700">
              {formatDPS(finalBestDPS)}
            </div>
          </div>
        </div>

        {/* 결과 메타 정보 */}
        <div className="text-sm text-gray-500 text-center mb-6">
          <span className="font-semibold text-indigo-600">DPS 계산 기준:</span> {activeTime}초 시뮬레이션 가중 평균. 버프 효과는 해당 시간 내 가동률(Uptime)로 계산됩니다.
          {result.meta.exhaustive ? (
            <div className="text-xs mt-1">모든 보유 정령({result.meta.searchedCandidates}개)에 대해 완전 탐색을 진행했습니다.</div>
          ) : (
            <div className="text-xs mt-1">상위 {result.meta.searchedCandidates}개 정령으로 {result.meta.combinationsTried.toLocaleString()}개 조합 탐색을 진행했습니다. (60초 DPS 기준)</div>
          )}
        </div>

        {/* 최적 조합 정령 */}
        <h2 className="font-bold text-xl mb-4 text-green-900 border-b pb-2">최적 조합 정령 (상세 분석)</h2>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {result.bestCombo.map((s, i) => {
            const timeResult = s.timeResults[activeTime];
            if (!timeResult) return null;

            return (
              <div key={i} className={`border-2 border-green-200 rounded-xl p-4 text-center bg-white shadow-lg hover:shadow-xl transition flex flex-col justify-between`}>
                <div>
                  <div className={`font-extrabold text-lg mb-1 ${getGradeColor(s.grade)}`}>{s.name}</div>
                  <img src={assetUrl('spirits', s.image)} alt={s.name} className="w-20 h-20 mx-auto my-2 object-contain rounded-md" />
                  <div className={`text-xs mb-1 font-medium ${getElementColor(s.element_type)}`}>속성: {s.element_type || "N/A"}</div>
                  <div className={`text-xs mb-3 text-gray-500`}>등급: {SpiritGrade[s.grade] || s.grade || "—"}</div>
                </div>
                <div className="mt-auto pt-2 border-t border-gray-100">
                  <div className="text-lg text-green-700 font-bold mb-1">
                    총 DPS: {formatDPS(timeResult.dps)}
                  </div>
                  <div className="text-[10px] text-gray-600 space-y-0.5">
                    <div>기본 DPS: {formatDPS(timeResult.breakdown.base)}</div>
                    <div>스킬 DPS: {formatDPS(timeResult.breakdown.skillDPS)}</div>
                    <div>버프 DPS: {formatDPS(timeResult.breakdown.buffDPS)}</div>
                    <div className="font-bold text-indigo-500">
                      버프 가동률: {formatPercent(timeResult.breakdown.buffUptime)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 최상위 스킬 */}
        <h2 className="font-bold text-xl mb-4 text-blue-900 border-b pb-2">최상위 스킬 (상세 분석)</h2>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {result.bestSkills.map((skill, i) => (
            <div key={i} className="border-2 border-blue-200 rounded-xl p-4 text-center bg-white shadow-lg hover:shadow-xl transition flex flex-col justify-between">
              <div>
                <div className={`font-extrabold text-lg mb-1 ${getGradeColor(skill.grade)}`}>{skill.name}</div>
                <img src={assetUrl('skill', skill.image)} alt={skill.name} className="w-20 h-20 mx-auto my-2 object-contain rounded-md" />
                <div className={`text-xs mb-3 text-gray-500`}>등급: {SpiritGrade[skill.grade] || skill.grade || "—"}</div>
              </div>
              <div className="mt-auto pt-2 border-t border-gray-100">
                <div className="text-lg text-blue-700 font-bold mb-1">
                  총 DPS: {formatDPS(skill.dps)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center space-x-4 mt-8">
          <button onClick={handleReset} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition shadow-md">
            전체 초기화 (1단계로)
          </button>
          <button onClick={() => setStep(3)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-md">
            스킬 선택
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4Result;
