import { getCombinations } from '../combinations';
import { SIM_TIMES, gradeOrder } from './constants';
import { createTeamContext } from './context';
import { calculateTeamSpiritDamage, calculateSpiritTotalDamage } from './spiritDamage';
import { calculateSkillTotalDamage } from './skillDamage';
import { calculateCharacterTotalDamage } from './characterDamage';

export function pickBestCombo(ownedSpirits, ownedSkills, uiBuffs) {
    if (!ownedSpirits || ownedSpirits.length <= 5) {
        return { bestCombo: ownedSpirits, meta: { exhaustive: true, searchedCandidates: ownedSpirits.length } };
    }

    const benchmarkTime = SIM_TIMES[0];

    const top35Candidates = ownedSpirits.map(s => {
        const soloContext = createTeamContext([s]);
        const { totalDamage } = calculateSpiritTotalDamage(s, uiBuffs, soloContext, benchmarkTime);
        return { ...s, baseScore: totalDamage };
    })
    .sort((a, b) => {
        const gradeA = gradeOrder[a.grade] || 0;
        const gradeB = gradeOrder[b.grade] || 0;
        if (gradeA !== gradeB) return gradeB - gradeA;
        return b.baseScore - a.baseScore;
    })
    .slice(0, 35);

    const neutralContext = createTeamContext([]);
    const top5Skills = ownedSkills.map(skill => ({
        ...skill,
        baseScore: calculateSkillTotalDamage(skill, uiBuffs, neutralContext, benchmarkTime).totalDamage
    })).sort((a, b) => b.baseScore - a.baseScore).slice(0, 5);

    let bestCombo = [];
    let maxTotalDamage = -1;

    const combinations = getCombinations(top35Candidates, 5);
    
    for (const combo of combinations) {
        const teamContext = createTeamContext(combo);
        const spiritDamage = calculateTeamSpiritDamage(combo, uiBuffs, teamContext, benchmarkTime).totalDamage;
        const skillDamage = top5Skills.reduce((sum, skill) => sum + calculateSkillTotalDamage(skill, uiBuffs, teamContext, benchmarkTime).totalDamage, 0);
        const characterDamage = calculateCharacterTotalDamage(uiBuffs, teamContext, benchmarkTime).totalDamage;
        
        const currentTotalDamage = spiritDamage + skillDamage + characterDamage;

        if (currentTotalDamage > maxTotalDamage) {
            maxTotalDamage = currentTotalDamage;
            bestCombo = combo;
        }
    }

    const spiritsByElement = ownedSpirits.reduce((acc, s) => {
        const el = s.element_type;
        if (!acc[el]) acc[el] = [];
        acc[el].push(s);
        return acc;
    }, {});

    for (const element in spiritsByElement) {
        const elementSpirits = spiritsByElement[element];
        if (elementSpirits.length >= 5) {
            const elementCandidates = elementSpirits.map(s => {
                    const soloContext = createTeamContext([s]);
                    const { totalDamage } = calculateSpiritTotalDamage(s, uiBuffs, soloContext, benchmarkTime);
                    return { ...s, baseScore: totalDamage };
                })
                .sort((a, b) => b.baseScore - a.baseScore)
                .slice(0, 35);

            const monoCombos = getCombinations(elementCandidates, 5);

            for (const combo of monoCombos) {
                const teamContext = createTeamContext(combo);
                const spiritDamage = calculateTeamSpiritDamage(combo, uiBuffs, teamContext, benchmarkTime).totalDamage;
                const skillDamage = top5Skills.reduce((sum, skill) => sum + calculateSkillTotalDamage(skill, uiBuffs, teamContext, benchmarkTime).totalDamage, 0);
                const characterDamage = calculateCharacterTotalDamage(uiBuffs, teamContext, benchmarkTime).totalDamage;
                const currentTotalDamage = spiritDamage + skillDamage + characterDamage;

                if (currentTotalDamage > maxTotalDamage) {
                    maxTotalDamage = currentTotalDamage;
                    bestCombo = combo;
                }
            }
        }
    }

    return {
        bestCombo,
        bestSkills: top5Skills,
        meta: {
            exhaustive: false,
            searchedCandidates: top35Candidates.length,
            combinationsTried: combinations.length, // This is an approximation now
        },
    };
}
