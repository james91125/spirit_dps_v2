// src/utils/imagePath.js
// 한글/공백/폴더 포함 경로 모두 허용. 파일명만 뽑아서 require.context로 로딩.

const spiritCtx = require.context('../assets/spirits', false, /\.(png|jpe?g|gif)$/);
const skillCtx  = require.context('../assets/skill',   false, /\.(png|jpe?g|gif)$/);
const placeholder = require('../assets/placeholder.png');

// 컨텍스트 키는 항상 './파일명' 형태여야 함.
function toContextKey(anyPathOrName) {
  if (!anyPathOrName) return null;

  // 1) 디렉터리 구분자(\, /) 제거 → 파일명만
  const last = String(anyPathOrName).trim().split(/[\\/]/).pop();

  // 2) URL 인코딩 되어 들어온 경우(예: %EA%B0%93%20...) 복원
  let decoded = last;
  try { decoded = decodeURIComponent(last); } catch (_) {}

  // 3) 컨텍스트 키 형태로
  return `./${decoded}`;
}

export function assetUrl(kind /* 'spirits' | 'skill' */, pathOrName) {
  const key = toContextKey(pathOrName);
  if (!key) return placeholder;

  try {
    if (kind === 'spirits') return spiritCtx(key);
    if (kind === 'skill')   return skillCtx(key);
    return placeholder;
  } catch (err) {
    // 파일명에 공백/한글이 있어도 위 로직이면 대부분 해결됩니다.
    console.warn('이미지 로드 실패:', pathOrName, err);
    return placeholder;
  }
}
