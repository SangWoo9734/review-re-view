// 🔧 유틸리티 레이어 - 불용어 상수
// 관심사: 텍스트 분석에서 제외할 불용어 정의

// 한국어 불용어 리스트
export const KOREAN_STOPWORDS = new Set([
  '이', '그', '저', '것', '들', '의', '를', '을', '에', '와', '과', '도', '는', '은', '가', '이', 
  '에서', '으로', '로', '에게', '한테', '께', '부터', '까지', '동안', '위해', '대해', '위에',
  '아래', '옆', '앞', '뒤', '좌', '우', '위', '아래', '이런', '그런', '저런', '어떤',
  '이것', '그것', '저것', '여기', '거기', '저기', '어디', '언제', '어떻게', '왜', '무엇',
  '누구', '얼마', '몇', '어느', '하다', '되다', '있다', '없다', '이다', '아니다',
  '같다', '다르다', '좋다', '나쁘다', '크다', '작다', '많다', '적다', '높다', '낮다'
]);

// 영어 불용어 리스트
export const ENGLISH_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
  'his', 'her', 'its', 'our', 'their', 'not', 'no', 'yes', 'if', 'when', 'where', 'why', 'how'
]);

// 통합 불용어 검사 함수
export const isStopword = (word: string): boolean => {
  const lowercaseWord = word.toLowerCase();
  return KOREAN_STOPWORDS.has(lowercaseWord) || ENGLISH_STOPWORDS.has(lowercaseWord);
};

// 불용어 제거 함수
export const removeStopwords = (words: string[]): string[] => {
  return words.filter(word => !isStopword(word));
};