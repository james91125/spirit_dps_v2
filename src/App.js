// src/App.js
import React, { useState, useCallback, useEffect } from 'react';
import Step0Tutorial from './components/Step0Tutorial';
import Step1BuffSetup from './components/Step1BuffSetup';
import Step2OwnedSelect from './components/Step2OwnedSelect';
import Step3OwnedStats from './components/Step3OwnedStats';
import Step4Result from './components/Step4Result';

import { spiritsData as allSpirits } from './data/spiritsData';
import { skillData } from './data/skillData';
import { calculateTotalDPS } from './utils/calculateDPS';

import { SIM_TIMES } from './utils/constants';
import { pickBestCombo } from './utils/damage/optimizer';

export default function App() {
  const [step, setStep] = useState(0);

  const [buffs, setBuffs] = useState({
    attackAmplify: 0, // 스킬 공격력 증폭
    finalAttack: 0,
    spiritAttackAmplify: 0,
    fireAmplify: 0,
    waterAmplify: 0,
    grassAmplify: 0,
    lightAmplify: 0,
    darkAmplify: 0,
    charAttack: 0, // 캐릭터 공격력
    critDamage: 0, // 치명타 증폭
    critChance: 0, // 치명타 확률
    charAttackSpeed: 0, // 캐릭터 공격 속도
  });

  const [ownedSpirits, setOwnedSpirits] = useState([]);
  const [ownedSkills, setOwnedSkills] = useState([]);
  const [result, setResult] = useState(null);

  const goNext = () => setStep((s) => s + 1);
  const goPrev = () => setStep((s) => s - 1);

  const handleReset = useCallback(() => {
    setOwnedSpirits([]);
    setOwnedSkills([]);
    setResult(null);
    setStep(0); // Step0으로 돌아감
  }, []);

  // Step 3 → Step 4 이동
  const goToResultStep = () => setStep(4);

  // Step 4 진입 시 결과 계산
  useEffect(() => {
    if (step === 4) {
      if (ownedSpirits.length === 0 && ownedSkills.length === 0) {
        alert('정령 또는 스킬을 하나 이상 선택해주세요.');
        setStep(2);
        return;
      }

      console.log('Calculating results with:', { ownedSpirits, ownedSkills, buffs });

      // Use pickBestCombo to get the optimal team
      const { bestCombo, meta } = pickBestCombo(ownedSpirits, buffs);

      const finalResult = {
        bestDPS: {},
        bestCombo: bestCombo.map(s => ({ ...s, timeResults: {} })),
        bestSkills: ownedSkills.map(skill => ({ ...skill, timeResults: {} })),
        characterDamage: {},
        meta,
      };

      SIM_TIMES.forEach(time => {
        const dpsResult = calculateTotalDPS(buffs, bestCombo, ownedSkills, time);

        finalResult.bestDPS[time] = dpsResult.total;
        finalResult.characterDamage[time] = dpsResult.char;

        // Populate bestCombo with spirit-specific results for each time
        dpsResult.spirits.forEach((spiritResult) => {
          const spiritInFinalResult = finalResult.bestCombo.find(s => s.name === spiritResult.name);
          if (spiritInFinalResult) {
            spiritInFinalResult.timeResults[time] = {
              dps: spiritResult.dps,
              totalDamage: spiritResult.totalDamage,
              breakdown: {
                base: spiritResult.breakdown.base,
                skill: spiritResult.breakdown.skill,
                buffUptime: spiritResult.breakdown.buffUptime,
                casts: spiritResult.breakdown.casts, // Add casts for spirit skills
              }
            };
          }
        });

        // Populate bestSkills with skill-specific results for each time
        dpsResult.skills.forEach((skillResult) => {
            const skillInFinalResult = finalResult.bestSkills.find(s => s.name === skillResult.name);
            if (skillInFinalResult) {
                skillInFinalResult.timeResults[time] = {
                    dps: skillResult.dps,
                    totalDamage: skillResult.totalDamage,
                    casts: skillResult.casts, // Add casts for character skills
                };
            }
        });
      });

      setResult(finalResult);
    }
  }, [step, ownedSpirits, ownedSkills, buffs]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* ✅ Step0: 튜토리얼 */}
      {step === 0 && <Step0Tutorial goNext={goNext} />}

      {/* Step1: 버프 설정 */}
      {step === 1 && (
        <Step1BuffSetup buffs={buffs} setBuffs={setBuffs} goNext={goNext} />
      )}

      {/* Step2: 정령 선택 */}
      {step === 2 && (
        <Step2OwnedSelect
          spiritsData={allSpirits}
          ownedSpirits={ownedSpirits}
          setOwnedSpirits={setOwnedSpirits}
          goNext={goNext}
          goPrev={goPrev}
        />
      )}

      {/* Step3: 스킬 선택 */}
      {step === 3 && (
        <Step3OwnedStats
          skillData={skillData}
          ownedSkills={ownedSkills}
          setOwnedSkills={setOwnedSkills}
          calculateResult={goToResultStep}
          goPrev={goPrev}
        />
      )}

      {/* Step4: 결과 출력 */}
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
