

// src/utils/damage/optimizer.js
import { getCombinations } from '../combinations';
import { SIM_TIMES } from './constants';
import { calculateTotalDPS } from '../calculateDPS';

/**
 * pickBestCombo
 *
 * Finds the best spirit combination (up to maxTeamSize) using the unified DPS formula.
 *
 * Parameters:
 *  - ownedSpirits: array of spirit objects (DB entries)
 *  - ownedSkills: array of skill objects (optional; used to compute skill damage contribution)
 *  - uiBuffs: UI buff inputs from step1
 *  - options:
 *      - maxTeamSize (default 5) : maximum number of spirits on a team
 *      - topCandidates (default 35) : how many top spirits to include for exhaustive combination search
 *      - elementOptimization ('both'|'mono'|'diverse') : search strategy
 *          'both' -> search global combos + mono-element combos
 *          'mono' -> only mono-element combos
 *          'diverse' -> only global combos across all elements
 *      - simTime (default SIM_TIMES[0]) : benchmark time for scoring
 *
 * Returns:
 *  { bestCombo, bestSkills, meta }
 */
export function pickBestCombo(ownedSpirits, uiBuffs = {}, options = {}) {
  const {
    maxTeamSize = 5,
    topCandidates = 35,
    elementOptimization = 'both',
    simTime = SIM_TIMES[0],
  } = options;

  if (!ownedSpirits || ownedSpirits.length === 0) {
    return { bestCombo: [], meta: { exhaustive: true, searchedCandidates: 0, combinationsTried: 0 } };
  }

  // Helper: score a spirit as a solo contribution (use calculateTotalDPS with that spirit only)
  function scoreSpiritSolo(spirit) {
    // calculateTotalDPS returns aggregated result; use total.totalDamage over simTime
    const result = calculateTotalDPS(uiBuffs, [spirit], [], simTime);
    return result.total.totalDamage;
  }

  // 1) Identify 'buff' spirits that give team-wide bonuses (always include them in candidate pool)
  const buffSpirits = ownedSpirits.filter(s => {
    return (
      (s.light_type_buff && s.light_type_buff !== 0) ||
      (s.dark_type_buff && s.dark_type_buff !== 0) ||
      (s.fire_type_buff && s.fire_type_buff !== 0) ||
      (s.water_type_buff && s.water_type_buff !== 0) ||
      (s.grass_type_buff && s.grass_type_buff !== 0) ||
      (s.character_type_buff && s.character_type_buff !== 0)
    );
  });

  // 2) Score other spirits by solo performance
  const otherSpirits = ownedSpirits.filter(s => !buffSpirits.includes(s));
  const scoredOther = otherSpirits.map(s => ({ spirit: s, baseScore: scoreSpiritSolo(s) }))
    .sort((a, b) => b.baseScore - a.baseScore);

  console.log("--- Optimizer: Buff Spirits ---", buffSpirits.map(s => s.name));
  console.log("--- Optimizer: Scored Other Spirits (Top 10) ---", scoredOther.slice(0, 10).map(s => ({ name: s.spirit.name, score: s.baseScore })));

  // 3) Build top candidate pool (buffs + top of scoredOther)
  const numBuffSpirits = buffSpirits.length;
  const numOtherToTake = Math.max(0, topCandidates - numBuffSpirits);
  const globalCandidates = [
    ...buffSpirits,
    ...scoredOther.slice(0, numOtherToTake).map(x => x.spirit)
  ];

  console.log("--- Optimizer: Final Candidate Pool ---", globalCandidates.map(s => s.name));

  // Utility to generate combinations of size 1..maxTeamSize
  function combinationsUpTo(arr, maxSize) {
    const results = [];
    const n = arr.length;
    for (let k = 1; k <= Math.min(maxSize, n); k++) {
      const combos = getCombinations(arr, k);
      for (const c of combos) results.push(c);
    }
    return results;
  }

  // 4) Candidate pools to test depending on elementOptimization
  const candidatePools = [];
  if (elementOptimization === 'both' || elementOptimization === 'diverse') {
    candidatePools.push({ name: 'global', pool: globalCandidates });
  }

  if (elementOptimization === 'both' || elementOptimization === 'mono') {
    // Build mono-element candidate lists
    const byElement = ownedSpirits.reduce((acc, s) => {
      const el = s.element_type || 'none';
      if (!acc[el]) acc[el] = [];
      acc[el].push(s);
      return acc;
    }, {});
    Object.keys(byElement).forEach(el => {
      const arr = byElement[el];
      // score and take topN per element (to avoid explosion)
      const scored = arr.map(s => ({ spirit: s, baseScore: scoreSpiritSolo(s) }))
        .sort((a,b) => b.baseScore - a.baseScore)
        .slice(0, Math.max(topCandidates, maxTeamSize));
      candidatePools.push({ name: `mono:${el}`, pool: [...buffSpirits.filter(b => b.element_type === el), ...scored.map(x => x.spirit)] });
    });
  }

  // 5) Evaluate combos across candidate pools
  let bestCombo = [];
  let bestTotalDamage = -Infinity;
  let combinationsTried = 0;
  const sim = simTime;

  console.log(`--- Optimizer: Starting combination search (Max ${maxTeamSize} spirits) ---`);

  for (const poolObj of candidatePools) {
    const pool = Array.from(new Set(poolObj.pool)); // dedupe
    if (pool.length === 0) continue;

    // Limit pool size to topCandidates again (defensive)
    const poolLimited = pool.slice(0, Math.max(topCandidates, pool.length));

    // Generate combos of 1..maxTeamSize from poolLimited
    const combos = combinationsUpTo(poolLimited, maxTeamSize);

    for (const combo of combos) {
      combinationsTried++;

      // element constraint: ensure not exceed max per element (default = maxTeamSize)
      const elementCounts = {};
      let exceed = false;
      for (const s of combo) {
        const el = s.element_type || 'none';
        elementCounts[el] = (elementCounts[el] || 0) + 1;
        if (elementCounts[el] > maxTeamSize) { exceed = true; break; }
      }
      if (exceed) continue;

      // Use calculateTotalDPS to get totalDamage for this combo
      const comboResult = calculateTotalDPS(uiBuffs, combo, [], sim);

      const combinedTotalDamage = comboResult.total.totalDamage;

      console.log(`- Testing Combo: [${combo.map(s => s.name).join(', ')}] -> Damage: ${Math.floor(combinedTotalDamage)}`);

      if (combinedTotalDamage > bestTotalDamage) {
        console.log(`  -> NEW BEST COMBO FOUND!`);
        bestTotalDamage = combinedTotalDamage;
        bestCombo = combo;
      }
    }
  }

  console.log(`--- Optimizer: Search Complete ---`);
  console.log(`- Best Combo: [${bestCombo.map(s => s.name).join(', ')}]`);
  console.log(`- Best Damage: ${Math.floor(bestTotalDamage)}`);
  return {
    bestCombo,
    meta: {
      exhaustive: false,
      searchedCandidates: globalCandidates.length,
      combinationsTried,
      bestTotalDamage,
      simTime: sim
    }
  };
}

