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

    // Separate spirits with team-wide buffs to ensure they are always considered.
    const buffSpirits = ownedSpirits.filter(s =>
        s.light_type_buff > 0 ||
        s.dark_type_buff > 0 ||
        s.fire_type_buff > 0 ||
        s.water_type_buff > 0 ||
        s.grass_type_buff > 0 ||
        s.character_type_buff > 0
    );

    // Score and sort the rest of the spirits based on their individual performance.
    const otherSpirits = ownedSpirits.filter(s => !buffSpirits.includes(s));
    const scoredOtherSpirits = otherSpirits.map(s => {
        const soloContext = createTeamContext([s]);
        const { totalDamage } = calculateSpiritTotalDamage(s, uiBuffs, soloContext, benchmarkTime);
        return { ...s, baseScore: totalDamage };
    })
    .sort((a, b) => {
        const gradeA = gradeOrder[a.grade] || 0;
        const gradeB = gradeOrder[b.grade] || 0;
        if (gradeA !== gradeB) return gradeB - gradeA;
        return b.baseScore - a.baseScore;
    });

    // Combine buff spirits with the top-performing non-buff spirits to form the candidate pool.
    const topN = 35;
    const numBuffSpirits = buffSpirits.length;
    const numOtherToTake = Math.max(0, topN - numBuffSpirits);

    const topCandidates = [
        ...buffSpirits,
        ...scoredOtherSpirits.slice(0, numOtherToTake)
    ];

    const neutralContext = createTeamContext([]);
    const top5Skills = ownedSkills.map(skill => ({
        ...skill,
        baseScore: calculateSkillTotalDamage(skill, uiBuffs, neutralContext, benchmarkTime).totalDamage
    })).sort((a, b) => b.baseScore - a.baseScore).slice(0, 5);

    let bestCombo = [];
    let maxTotalDamage = -1;

    const combinations = getCombinations(topCandidates, 5);
    
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
            // The same logic as above, but scoped to the current element
            const elementBuffSpirits = elementSpirits.filter(s =>
                s.light_type_buff > 0 ||
                s.dark_type_buff > 0 ||
                s.fire_type_buff > 0 ||
                s.water_type_buff > 0 ||
                s.grass_type_buff > 0 ||
                s.character_type_buff > 0
            );
            const elementOtherSpirits = elementSpirits.filter(s => !elementBuffSpirits.includes(s));
            const scoredElementOtherSpirits = elementOtherSpirits.map(s => {
                const soloContext = createTeamContext([s]);
                const { totalDamage } = calculateSpiritTotalDamage(s, uiBuffs, soloContext, benchmarkTime);
                return { ...s, baseScore: totalDamage };
            }).sort((a, b) => b.baseScore - a.baseScore);

            const elementTopN = 35;
            const numElementBuffSpirits = elementBuffSpirits.length;
            const numElementOtherToTake = Math.max(0, elementTopN - numElementBuffSpirits);

            const elementCandidates = [
                ...elementBuffSpirits,
                ...scoredElementOtherSpirits.slice(0, numElementOtherToTake)
            ];

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
            searchedCandidates: topCandidates.length,
            combinationsTried: combinations.length, // This is an approximation now
        },
    };
}
