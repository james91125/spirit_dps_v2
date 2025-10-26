import React from 'react';
import { SpiritGrade } from '../utils/constants';

const Step4Result = ({ result, setStep, setOwnedSpirits, setSelectedSpirits, setResult }) => {
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">계산 결과</h1>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-lg text-gray-700 mb-2">현재 배치 DPS</div>
            <div className="text-4xl font-bold text-indigo-700">{result.totalDPS}</div>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-lg text-gray-700 mb-2">최적 조합 DPS</div>
            <div className="text-4xl font-bold text-green-600">{result.bestDPS}</div>
          </div>
        </div>

        <div className="text-center mb-8 p-4 bg-yellow-50 rounded-lg">
          <div className="text-lg text-gray-700">DPS 차이</div>
          <div className={`text-3xl font-bold ${parseFloat(result.difference) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(result.difference) >= 0 ? '+' : ''}
            {result.difference}
          </div>
        </div>

        <h2 className="font-bold text-xl mb-4 text-indigo-900">현재 배치 정령</h2>
        <div className="grid grid-cols-5 gap-3 mb-8">
          {result.details.map((detail, i) => (
            <div key={i} className="border-2 border-indigo-200 rounded-lg p-4 text-center bg-indigo-50">
              <div className="font-semibold">{detail.name}</div>
              <div className="text-xs text-green-700 mt-2">DPS: {detail.dps}</div>
            </div>
          ))}
        </div>

        <h2 className="font-bold text-xl mb-4 text-green-900">최적 조합 정령</h2>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {result.bestCombo.map((s, i) => (
            <div key={i} className="border-2 border-green-200 rounded-lg p-4 text-center bg-green-50">
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-600 mt-1">{SpiritGrade[s.grade]}</div>
              <div className="text-xs text-green-700 mt-2">DPS: {s.dps.toFixed(2)}</div>
            </div>
          ))}
        </div>

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
