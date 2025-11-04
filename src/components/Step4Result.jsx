// Re-saving to force bundler refresh
import React, { useState } from "react";
import { SpiritGrade } from "../utils/constants";
import { elementColors, gradeColors } from "../utils/colorMaps";
import { SIM_TIMES } from "../utils/constants";
import { assetUrl } from "../utils/imagePath";

const Step4Result = ({ result, setStep, handleReset }) => {
  const [activeTime, setActiveTime] = useState(SIM_TIMES[0]);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  if (!result) return null;

  const handleMouseEnter = (comment, e) => {
    setTooltip({
      visible: true,
      content: comment,
      x: e.pageX + 10, // Add offset to avoid cursor overlap
      y: e.pageY + 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const getGradeColor = (grade) => gradeColors[grade] || "text-gray-600";
  const getElementColor = (element) => elementColors[element] || "text-gray-600";

  const formatDPS = (val) => (val ? Math.floor(val).toLocaleString() : "0");
  const formatPercent = (val) => (val ? Number(val).toFixed(2) : "0.00");
  const formatTotalDamage = (val) => {
    if (!val) return "0";
    const floorVal = Math.floor(val);
    if (floorVal > 1_000_000_000) return `${(floorVal / 1_000_000_000).toFixed(2)}B`;
    if (floorVal > 1_000_000) return `${(floorVal / 1_000_000).toFixed(2)}M`;
    if (floorVal > 1_000) return `${(floorVal / 1_000).toFixed(2)}K`;
    return floorVal.toLocaleString();
  }

  const finalBestResult = result.bestDPS[activeTime];

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen">
      {tooltip.visible && (
        <div 
          className="fixed p-2 text-sm bg-gray-800 text-white rounded-md shadow-lg z-50 max-w-xs"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.content}
        </div>
      )}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-indigo-900">최적 배치 계산 결과</h1>

        {/* 시간 선택 탭 */}
        <div className="flex justify-center items-center mb-6 bg-gray-100 rounded-full p-1 shadow-inner flex-wrap">
          {SIM_TIMES.map(time => (
            <button
              key={time}
              onClick={() => setActiveTime(time)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 ${
                activeTime === time
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}
            >
              {time}초 기준
            </button>
          ))}
        </div>

        {/* 상단 요약 */}
        <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg shadow-inner mb-8">
            <div className="text-base sm:text-lg text-gray-700 mb-2">최적 조합 ({activeTime}초 기준)</div>
            <div className="flex justify-center items-baseline gap-x-4">
                <div>
                    <div className="text-xs text-gray-500">DPS</div>
                    <div className="text-3xl sm:text-4xl font-bold text-green-700">
                        {formatDPS(finalBestResult?.dps)}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">총 데미지</div>
                    <div className="text-3xl sm:text-4xl font-bold text-green-800">
                        {formatTotalDamage(finalBestResult?.totalDamage)}
                    </div>
                </div>
            </div>
        </div>

        {/* 결과 메타 정보 */}
        <div className="text-xs sm:text-sm text-gray-500 text-center mb-6">
          <span className="font-semibold text-indigo-600">계산 기준:</span> {activeTime}초 시뮬레이션. 버프 가동률과 스킬 사용 횟수를 반영하여 총 데미지를 계산합니다.
          {result.meta.exhaustive ? (
            <div className="text-xs mt-1">모든 보유 정령({result.meta.searchedCandidates}개)에 대해 완전 탐색을 진행했습니다.</div>
          ) : (
            <div className="text-xs mt-1">혼합 속성 및 단일 속성 조합을 포함하여 총 {result.meta.combinationsTried.toLocaleString()}개 조합 탐색을 진행했습니다. ({SIM_TIMES[0]}초 총 데미지 기준)</div>
          )}
        </div>

        {/* 최적 조합 정령 */}
        <h2 className="font-bold text-lg sm:text-xl mb-4 text-green-900 border-b pb-2">최적 조합 정령 (상세 분석)</h2>
        <div className="flex overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-4 mb-6">
          {result.bestCombo.map((s, i) => {
            const timeResult = s.timeResults[activeTime];
            if (!timeResult) return null;

            return (
              <div key={i} className={`flex-shrink-0 w-36 sm:w-48 border-2 border-green-200 rounded-xl p-2 sm:p-4 text-center bg-white shadow-lg hover:shadow-xl transition flex flex-col justify-between lg:w-full`}>
                <div>
                  <div className={`font-extrabold text-base sm:text-lg mb-1 ${getGradeColor(s.grade)}`}>{s.name}</div>
                  <img 
                    src={assetUrl('spirits', s.image)} 
                    alt={s.name} 
                    onMouseEnter={(e) => handleMouseEnter(s.comment, e)}
                    onMouseLeave={handleMouseLeave}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto my-2 object-contain rounded-md cursor-pointer" 
                  />
                  <div className={`text-xs mb-1 font-medium ${getElementColor(s.element_type)}`}>속성: {s.element_type || "N/A"}</div>
                  <div className={`text-xs mb-3 text-gray-500`}>등급: {SpiritGrade[s.grade] || s.grade || "—"}</div>
                </div>
                <div className="mt-auto pt-2 border-t border-gray-100">
                  <div className="text-sm sm:text-base text-green-800 font-bold mb-1">
                    <div>총 DPS</div>
                    {formatDPS(timeResult.dps)}
                  </div>
                  <div className="text-sm sm:text-base text-green-700 font-bold mb-1">
                    <div>총 데미지</div>
                    {formatTotalDamage(timeResult.totalDamage)}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 mt-2">
                    <div>평타 1방당 데미지: {formatDPS(timeResult.breakdown.base)}</div>
                    <div>기본 DPS: {formatDPS(timeResult.breakdown.base)}</div>
                    <div>스킬 DPS: {formatDPS(timeResult.breakdown.skill)}</div>
                    {timeResult.breakdown.casts > 0 && (
                      <div className="text-[10px] sm:text-xs text-gray-600">
                        시전 횟수: {timeResult.breakdown.casts}회
                      </div>
                    )}
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
        <h2 className="font-bold text-lg sm:text-xl mb-4 text-blue-900 border-b pb-2">최상위 스킬 (상세 분석)</h2>
        <div className="flex overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-4 mb-6">
          {result.bestSkills.map((skill, i) => {
            const timeResult = skill.timeResults[activeTime];
            if (!timeResult) return null;

            return (
                <div key={i} className="flex-shrink-0 w-36 sm:w-48 border-2 border-blue-200 rounded-xl p-2 sm:p-4 text-center bg-white shadow-lg hover:shadow-xl transition flex flex-col justify-between lg:w-full">
                    <div>
                        <div className={`font-extrabold text-base sm:text-lg mb-1 ${getGradeColor(skill.grade)}`}>{skill.name}</div>
                        <img 
                          src={assetUrl('skill', skill.image)} 
                          alt={skill.name} 
                          onMouseEnter={(e) => handleMouseEnter(skill.comment, e)}
                          onMouseLeave={handleMouseLeave}
                          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto my-2 object-contain rounded-md cursor-pointer" 
                        />
                        <div className={`text-xs mb-3 text-gray-500`}>등급: {SpiritGrade[skill.grade] || skill.grade || "—"}</div>
                    </div>
                    <div className="mt-auto pt-2 border-t border-gray-100">
                        <div className="text-sm sm:text-base text-blue-800 font-bold mb-1">
                            <div>DPS</div>
                            {formatDPS(timeResult.dps)}
                        </div>
                        <div className="text-sm sm:text-base text-blue-700 font-bold mb-1">
                            <div>총 데미지</div>
                            {formatTotalDamage(timeResult.totalDamage)}
                        </div>
                        {timeResult.casts > 0 && (
                          <div className="text-[10px] sm:text-xs text-gray-600 mt-2">
                            시전 횟수: {timeResult.casts}회
                          </div>
                        )}
                    </div>
                </div>
            )
          })}
        </div>

        {/* 캐릭터 데미지 */}
        <h2 className="font-bold text-lg sm:text-xl mb-4 text-purple-900 border-b pb-2">캐릭터 정보 (상세 분석)</h2>
        <div className="flex justify-center pb-4 mb-6">
            <div className="border-2 border-purple-200 rounded-xl p-2 sm:p-4 text-center bg-white shadow-lg hover:shadow-xl transition w-36 sm:w-48">
                <div className="font-extrabold text-base sm:text-lg mb-1 text-purple-700">캐릭터</div>
                <div className="mt-auto pt-2 border-t border-gray-100">
                    <div className="text-sm sm:text-base text-purple-800 font-bold mb-1">
                        <div>캐릭터 DPS</div>
                        {formatDPS(result.characterDamage[activeTime].dps)}
                    </div>
                    <div className="text-sm sm:text-base text-purple-700 font-bold mb-1">
                        <div>캐릭터 총 데미지</div>
                        {formatTotalDamage(result.characterDamage[activeTime].totalDamage)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-600 space-y-0.5 mt-2">
                        <div>평타 1방당 데미지 (평균): {formatDPS(result.characterDamage[activeTime].damagePerHit)}</div>
                        {result.characterDamage[activeTime].critChance < 1 && (
                            <>
                                <div>평타 1방당 데미지 (비치명): {formatDPS(result.characterDamage[activeTime].nonCritDamagePerHit)}</div>
                                <div>평타 1방당 데미지 (치명): {formatDPS(result.characterDamage[activeTime].critDamagePerHit)}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center space-x-4 mt-8">
          <button onClick={handleReset} className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition shadow-md text-sm sm:text-base">
            전체 초기화 (1단계로)
          </button>
          <button onClick={() => setStep(3)} className="px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition shadow-md text-sm sm:text-base">
            정령/스킬 재선택 (2단계로)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4Result;
