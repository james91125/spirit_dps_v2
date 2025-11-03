import { SIM_TIMES } from './damage/constants';
import { createTeamContext } from './damage/context';
import { calculateTeamSpiritDamage } from './damage/spiritDamage';
import { calculateSkillTotalDamage } from './damage/skillDamage';
import { calculateCharacterTotalDamage } from './damage/characterDamage';
import { pickBestCombo } from './damage/optimizer';

export { SIM_TIMES }; // Export for UI components

export function calculateFinalResults(ownedSpirits, ownedSkills, uiBuffs) {
    const { bestCombo, bestSkills, meta } = pickBestCombo(ownedSpirits, ownedSkills, uiBuffs);

    const result = {
        bestDPS: {}, 
        bestCombo: [],
        bestSkills: [],
        characterDamage: {},
        meta,
    };

    // Re-run calculations for the winning combo for all simulation times to generate detailed results for the UI
    SIM_TIMES.forEach(time => {
        const teamContext = createTeamContext(bestCombo);
        const spiritResult = calculateTeamSpiritDamage(bestCombo, uiBuffs, teamContext, time);
        const skillResult = bestSkills.map(skill => ({
            ...skill,
            timeResults: { [time]: calculateSkillTotalDamage(skill, uiBuffs, teamContext, time) }
        }));
        const charResult = calculateCharacterTotalDamage(uiBuffs, teamContext, time);

        const totalSkillDamage = skillResult.reduce((sum, s) => sum + s.timeResults[time].totalDamage, 0);
        const totalDamage = spiritResult.totalDamage + totalSkillDamage + charResult.totalDamage;

        result.bestDPS[time] = { totalDamage, dps: totalDamage / time };
        result.characterDamage[time] = charResult;
        
        // Augment results for UI display
        spiritResult.spiritMetrics.forEach((spirit, index) => {
            if (!result.bestCombo[index]) {
                result.bestCombo[index] = { ...spirit, timeResults: {} };
            }
            result.bestCombo[index].timeResults[time] = spirit.timeResults[time];
        });
        skillResult.forEach((skill, index) => {
            if (!result.bestSkills[index]) {
                result.bestSkills[index] = { ...skill, timeResults: {} };
            }
            result.bestSkills[index].timeResults[time] = skill.timeResults[time];
        });
    });

    return result;
}
