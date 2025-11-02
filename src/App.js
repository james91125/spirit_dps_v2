import React, { useState, useCallback, useEffect } from 'react';
import Step1BuffSetup from './components/Step1BuffSetup';
import Step2OwnedSelect from './components/Step2OwnedSelect';
import Step3OwnedStats from './components/Step3OwnedStats';
import Step4Result from './components/Step4Result';

import { spiritsData as allSpirits } from './data/spiritsData'; // 원본 데이터 사용
import { skillData } from './data/skillData';
import { calculateFinalResults } from './utils/calculateDPS'; // 새로운 계산 함수

export default function App() {
  const [step, setStep] = useState(1);
  const [buffs, setBuffs] = useState({
    attackAmplify: 0, // 스킬 공격력 증폭
    finalAttack: 0,
    spiritAttackAmplify: 0,
    fireAmplify: 0,
    waterAmplify: 0,
    grassAmplify: 0,
    lightAmplify: 0,
    darkAmplify: 0,
  });
  const [ownedSpirits, setOwnedSpirits] = useState([]);
  const [ownedSkills, setOwnedSkills] = useState([]);
  const [result, setResult] = useState(null); // 계산 결과 저장

  const goNext = () => setStep((s) => s + 1);
  const goPrev = () => setStep((s) => s - 1);
  
  const handleReset = useCallback(() => {
    setOwnedSpirits([]);
    setOwnedSkills([]);
    setResult(null);
    setStep(1);
  }, []);

  // Step 3에서 Step 4로 이동만 담당
  const goToResultStep = () => setStep(4);

  // Step 4에 진입하면 계산을 수행
  useEffect(() => {
    if (step === 4) {
      if (ownedSpirits.length === 0 && ownedSkills.length === 0) {
        alert("정령 또는 스킬을 하나 이상 선택해주세요.");
        setStep(2); // 정령 선택으로 복귀
        return;
      }
      console.log("Calculating results with:", { ownedSpirits, ownedSkills, buffs });
      const res = calculateFinalResults(ownedSpirits, ownedSkills, buffs);
      setResult(res);
    }
  }, [step, ownedSpirits, ownedSkills, buffs]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {step === 1 && (
        <Step1BuffSetup buffs={buffs} setBuffs={setBuffs} goNext={goNext} />
      )}

      {step === 2 && (
        <Step2OwnedSelect
          spiritsData={allSpirits} // 전체 정령 데이터
          ownedSpirits={ownedSpirits}
          setOwnedSpirits={setOwnedSpirits}
          goNext={goNext}
          goPrev={goPrev}
        />
      )}

      {step === 3 && (
        <Step3OwnedStats
          skillData={skillData}
          ownedSkills={ownedSkills}
          setOwnedSkills={setOwnedSkills}
          calculateResult={goToResultStep} // 이름 변경: calculateAndGoToResult -> goToResultStep
          goPrev={goPrev}
        />
      )}

      {step === 4 && result && (
        <Step4Result
          result={result}
          setStep={setStep}
          handleReset={handleReset}
        />
      )}
    </div>
  );
}
