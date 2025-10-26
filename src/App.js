import React, { useState } from 'react';
import Step1BuffSetup from './components/Step1BuffSetup';
import Step2Placement from './components/Step2Placement';
import Step3OwnedSelect from './components/Step3OwnedSelect';
import Step4Result from './components/Step4Result';
import { calcSpiritDPS } from './utils/calculateDPS';
import spiritsData from './data/spiritsData';

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
  });
  const [selectedSpirits, setSelectedSpirits] = useState([null, null, null, null, null]);
  const [ownedSpirits, setOwnedSpirits] = useState([]);
  const [result, setResult] = useState(null);

  const calculateResult = () => {
    let totalDPS = 0;
    const details = [];

    // 현재 배치된 정령 DPS 계산
    selectedSpirits.forEach((spirit) => {
      if (!spirit) return;
      const { dps, base, attackAmp, typeAmp, totalAmpPercent } = calcSpiritDPS(spirit, buffs);
      totalDPS += dps;
      details.push({
        name: spirit.name,
        dps: dps.toFixed(2),
        calculation: `(${spirit.attackCoef} × ${spirit.attackSpeed}) × (1 + (${attackAmp.toFixed(
          1
        )}% + ${typeAmp.toFixed(1)}%)/100) = ${base.toFixed(3)} × (1 + ${totalAmpPercent.toFixed(
          1
        )}%/100)`,
      });
    });

    // 보유 정령 중 상위 5개 DPS 계산
    const sorted = [...ownedSpirits]
      .map((s) => {
        const { dps } = calcSpiritDPS(s, buffs);
        return { ...s, dps };
      })
      .sort((a, b) => b.dps - a.dps)
      .slice(0, 5);

    const bestDPS = sorted.reduce((sum, s) => sum + s.dps, 0);

    // 결과 저장
    setResult({
      totalDPS: totalDPS.toFixed(2),
      bestCombo: sorted,
      bestDPS: bestDPS.toFixed(2),
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
          spiritsData={spiritsData}
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
      {step === 4 && (
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
