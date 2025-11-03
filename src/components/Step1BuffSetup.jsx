import React from 'react';

const Step1BuffSetup = ({ buffs, setBuffs, goNext }) => {
  const handleBuffChange = (key, value) =>
    setBuffs({ ...buffs, [key]: parseFloat(value) || 0 });

  const buffGroups = [
    {
      title: '기본 스탯',
      buffs: {
        '공격력': 'charAttack',

      }
    },
    {
      title: '특수 스탯',
      buffs: {
        '캐릭터 공격 속도': 'charAttackSpeed',
        '공격력 증폭 (%)': 'attackAmplify',
        '치명타 확률 (%)': 'critChance',
        '치명타 증폭 (%)': 'critDamage',
      }
    },
    {
      title: '정령 스탯',
      buffs: {
        '정령 공격력 증폭 (%)': 'spiritAttackAmplify',
        '불 타입 증폭 (%)': 'fireAmplify',
        '물 타입 증폭 (%)': 'waterAmplify',
        '풀 타입 증폭 (%)': 'grassAmplify',
        '빛 타입 증폭 (%)': 'lightAmplify',
        '어둠 타입 증폭 (%)': 'darkAmplify',
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-8 flex flex-col" style={{height: '90vh'}}>
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-indigo-900 flex-shrink-0">
          정령 배치 계산기
        </h1>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
          {buffGroups.map(group => (
            <div key={group.title}>
              <h2 className="text-lg font-semibold text-indigo-800 border-b-2 border-indigo-200 pb-2 mb-4">{group.title}</h2>
              <div className="space-y-4">
                {Object.entries(group.buffs).map(([label, key]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                      value={buffs[key]}
                      onChange={(e) => handleBuffChange(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goNext}
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-md flex-shrink-0"
        >
          정령 배치하기
        </button>
      </div>
    </div>
  );
};

export default Step1BuffSetup;
