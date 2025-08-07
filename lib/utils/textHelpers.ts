// 🔧 유틸리티 레이어 - 텍스트 조작 헬퍼 함수
// 관심사: 문자열 조작, 검증, 변환

/**
 * 문자열을 지정된 길이로 자르고 생략 표시 추가
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 문자열에서 HTML 태그 제거
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 문자열에서 마크다운 문법 제거
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s/g, '') // 헤더
    .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1') // 볼드, 이탤릭
    .replace(/`([^`]+)`/g, '$1') // 인라인 코드
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1'); // 이미지
}

/**
 * 문자열 정규화 (공백 제거, 소문자 변환)
 */
export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

/**
 * 카멜케이스를 케밥케이스로 변환
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 케밥케이스를 카멜케이스로 변환
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 문자열이 비어있는지 확인 (null, undefined, 공백 포함)
 */
export function isEmpty(text: string | null | undefined): boolean {
  return !text || text.trim().length === 0;
}

/**
 * 문자열에서 특수문자 제거 (알파벳, 숫자, 공백만 남김)
 */
export function sanitizeText(text: string): string {
  return text.replace(/[^a-zA-Z0-9가-힣\s]/g, '');
}

/**
 * 단어 개수 계산
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * 첫 글자 대문자로 변환
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * 여러 공백을 하나로 변환
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * 문자열이 특정 패턴과 일치하는지 확인 (대소문자 무시)
 */
export function matchesPattern(text: string, pattern: string): boolean {
  return text.toLowerCase().includes(pattern.toLowerCase());
}

/**
 * URL 안전한 슬러그 생성
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}