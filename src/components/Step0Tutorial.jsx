// src/components/Step0Tutorial.jsx
import React from "react";
import tutorial0 from "../assets/tutorial/tutorial0.png";
import tutorial1 from "../assets/tutorial/tutorial1.png";

const Step0Tutorial = ({ goNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 sm:p-8 flex flex-col">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-8 flex-1 flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-900">
          정령 DPS 시뮬레이터
        </h1>

        {/* 2분할 이미지 영역 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          <div className="flex justify-center">
            <img
              src={tutorial0}
              alt="튜토리얼 이미지 0"
              className="rounded-lg shadow-lg max-h-[300px] md:max-h-[500px] object-contain"
            />
          </div>
          <div className="flex justify-center">
            <img
              src={tutorial1}
              alt="튜토리얼 이미지 1"
              className="rounded-lg shadow-lg max-h-[300px] md:max-h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Step1으로 이동 */}
        <div className="mt-8 text-center">
          <button
            onClick={goNext}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition"
          >
            시작하기
          </button>
          <p className="mt-4 text-sm text-red-600 font-semibold">
            작성하기 전 펫 장착을 해제해 주세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step0Tutorial;
