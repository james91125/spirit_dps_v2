/**
 * 배열에서 r개의 아이템을 선택하는 모든 조합을 반환합니다. (nCr)
 * @param {Array} arr - 원본 배열
 * @param {number} r - 선택할 아이템의 수
 * @returns {Array<Array>} - 모든 조합의 배열
 */
export function getCombinations(arr, r) {
  if (r > arr.length) return [];
  const results = [];

  function combine(startIndex, currentCombo) {
    if (currentCombo.length === r) {
      results.push([...currentCombo]);
      return;
    }
    for (let i = startIndex; i < arr.length; i++) {
      currentCombo.push(arr[i]);
      combine(i + 1, currentCombo);
      currentCombo.pop();
    }
  }

  combine(0, []);
  return results;
}
