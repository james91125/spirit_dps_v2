import React from 'react';

const Step1BuffSetup = ({ buffs, setBuffs, goNext }) => {
  const handleBuffChange = (key, value) =>
    setBuffs({ ...buffs, [key]: parseFloat(value) || 0 });

  const buffList = {
    '공격력 증폭 (%)': 'attackAmplify',
    '정령 공격력 증폭 (%)': 'spiritAttackAmplify',
    '불 타입 증폭 (%)': 'fireAmplify',
    '물 타입 증폭 (%)': 'waterAmplify',
    '풀 타입 증폭 (%)': 'grassAmplify',
    '빛 타입 증폭 (%)': 'lightAmplify',
    '어둠 타입 증폭 (%)': 'darkAmplify',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
          정령 배치 계산기
        </h1>

        <div className="space-y-4">
          {Object.entries(buffList).map(([label, key]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={buffs[key]}
                onChange={(e) => handleBuffChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={goNext} // setStep(2) 대신 goNext 사용
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
        >
          정령 배치하기
        </button>
      </div>
    </div>
  );
};

export default Step1BuffSetup;
