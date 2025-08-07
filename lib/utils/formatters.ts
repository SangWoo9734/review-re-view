// 🔧 유틸리티 레이어 - 데이터 포맷팅 함수
// 관심사: 데이터를 사용자 친화적 형태로 변환

/**
 * 숫자를 천 단위 구분자로 포맷팅
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * 소수점 자릿수 제한
 */
export function formatDecimal(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

/**
 * TF-IDF 값 포맷팅 (소수점 3자리)
 */
export function formatTFIDF(value: number): string {
  return value.toFixed(3);
}

/**
 * 퍼센티지 포맷팅
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * 파일 크기 포맷팅 (bytes)
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${formatDecimal(size, 1)}${units[unitIndex]}`;
}

/**
 * 시간 포맷팅 (ms to readable format)
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${formatDecimal(ms / 1000)}초`;
  if (ms < 3600000) return `${formatDecimal(ms / 60000)}분`;
  return `${formatDecimal(ms / 3600000)}시간`;
}

/**
 * 키워드 빈도 표시 포맷
 */
export function formatKeywordFrequency(keyword: string, frequency: number): string {
  return `${keyword} (${frequency}회)`;
}

/**
 * 액션 아이템 우선순위 라벨
 */
export function formatPriorityLabel(priority: 'P1' | 'P2' | 'P3'): string {
  const labels = {
    P1: '긴급',
    P2: '중요', 
    P3: '제안'
  };
  return labels[priority] || priority;
}

/**
 * 복수형 처리 (개, 명, 회 등)
 */
export function formatPlural(count: number, unit: string = '개'): string {
  return `${formatNumber(count)}${unit}`;
}

/**
 * 날짜 상대 포맷 (몇 분 전, 몇 시간 전)
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return '방금 전';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
  return `${Math.floor(diff / 86400000)}일 전`;
}