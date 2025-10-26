import React, { useState } from 'react';
import Step1BuffSetup from './components/Step1BuffSetup';
import Step2Placement from './components/Step2Placement';
import Step3OwnedSelect from './components/Step3OwnedSelect';
import Step4Result from './components/Step4Result';
import spiritsData from './data/spiritsData';
import { calcTeamDPS, pickBestComboAndDPS, calcSpiritDPS } from './utils/calculateDPS';

const App = () => {
  const [step, setStep] = useState(1);

  const [buffs, setBuffs] = useState({
    attackAmplify: 0,
    spiritAttackAmplify: 0,
    fireAmplify: 0,
    waterAmplify: 0,
    grassAmplify: 0,
    lightAmplify: 0,
    darkAmplify: 0,
    finalAttack: 0, // 최종 공격력 배율
  });

  // 선택 정령 및 보유 정령
  const [selectedSpirits, setSelectedSpirits] = useState([null, null, null, null, null]);
  const [ownedSpirits, setOwnedSpirits] = useState([]);
  const [result, setResult] = useState(null);

  const calculateResult = () => {
    // 안전 검사
    const selected = Array.isArray(selectedSpirits) ? selectedSpirits : [];
    const owned = Array.isArray(ownedSpirits) ? ownedSpirits : [];

    // 1️ 현재 배치된 팀 DPS 계산
    const totalDPS = calcTeamDPS(selected, buffs);

    // 2️ 각 정령별 상세 DPS 기록 (속성, 등급 포함)
    const details = selected
      .filter((s) => s)
      .map((spirit) => {
        const { dps } = calcSpiritDPS(spirit, buffs);
        return {
          name: spirit.name,
          grade: spirit.grade,
          element_type: spirit.element_type,
          dps: dps.toFixed(2),
        };
      });

    // 3️ 보유 정령 중 최적 조합 5명 계산
    const { bestCombo, bestDPS } = pickBestComboAndDPS(owned, buffs);

    // 4️ 결과 저장
    setResult({
      totalDPS: totalDPS.toFixed(2),
      bestDPS: bestDPS.toFixed(2),
      bestCombo,
      difference: (bestDPS - totalDPS).toFixed(2),
      details,
    });

    setStep(4);
  };

  return (
    <>
      {step === 1 && (
        <Step1BuffSetup buffs={buffs} setBuffs={setBuffs} setStep={setStep} />
      )}

      {step === 2 && (
        <Step2Placement
          spirits={spiritsData}
          selectedSpirits={selectedSpirits}
          setSelectedSpirits={setSelectedSpirits}
          setStep={setStep}
        />
      )}

      {step === 3 && (
        <Step3OwnedSelect
          spiritsData={spiritsData}
          ownedSpirits={ownedSpirits}
          setOwnedSpirits={setOwnedSpirits}
          setStep={setStep}
          calculateResult={calculateResult}
        />
      )}

      {step === 4 && result && (
        <Step4Result
          result={result}
          setStep={setStep}
          setOwnedSpirits={setOwnedSpirits}
          setSelectedSpirits={setSelectedSpirits}
          setResult={setResult}
        />
      )}
    </>
  );
};

export default App;
