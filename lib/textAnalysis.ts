// 클라이언트 사이드 텍스트 분석 엔진
// Phase 5: Text Analysis Engine Implementation

import { KOREAN_STOPWORDS, ENGLISH_STOPWORDS } from '@/lib/constants/stopwords';

export interface KeywordData {
  keyword: string;
  frequency: number;
  tfidf: number;
  category: KeywordCategory;
  contexts: string[]; // 키워드가 등장한 문맥들
}

export interface AnalysisResult {
  keywords: KeywordData[];
  categories: Record<KeywordCategory, KeywordData[]>;
  totalWords: number;
  uniqueWords: number;
  averageWordsPerComment: number;
  commonPhrases: { phrase: string; count: number }[];
}

export type KeywordCategory = 
  | 'code-quality'      // 코드 품질 관련
  | 'performance'       // 성능 관련
  | 'bug-fix'          // 버그 수정
  | 'architecture'     // 아키텍처/구조 관련
  | 'testing'          // 테스트 관련
  | 'documentation'    // 문서화 관련
  | 'security'         // 보안 관련
  | 'ui-ux'           // UI/UX 관련
  | 'general';         // 일반적인 코멘트

// 카테고리별 키워드 매핑
const CATEGORY_KEYWORDS: Record<KeywordCategory, Set<string>> = {
  'code-quality': new Set([
    'refactor', 'refactoring', 'clean', 'cleanup', 'optimize', 'optimization', 'improve', 'improvement',
    'simplify', 'readable', 'maintainable', 'code smell', 'best practice', 'pattern', 'solid',
    'dry', 'naming', 'variable', 'function', 'method', 'class', 'component', 'structure',
    '리팩토링', '리팩터', '개선', '최적화', '정리', '클린코드', '가독성', '유지보수', '네이밍', '구조'
  ]),
  'performance': new Set([
    'performance', 'speed', 'fast', 'slow', 'lag', 'memory', 'cpu', 'cache', 'optimize',
    'efficient', 'inefficient', 'bottleneck', 'latency', 'throughput', 'render', 'bundle',
    'lazy', 'async', 'await', 'promise', 'parallel', 'concurrent', 'debounce', 'throttle',
    '성능', '속도', '빠른', '느린', '메모리', '최적화', '효율', '병목', '렌더링', '번들', '지연'
  ]),
  'bug-fix': new Set([
    'bug', 'fix', 'error', 'issue', 'problem', 'crash', 'fail', 'broken', 'exception',
    'null', 'undefined', 'edge case', 'corner case', 'handle', 'catch', 'try', 'debug',
    'troubleshoot', 'resolve', 'solution', 'patch', 'hotfix',
    '버그', '에러', '오류', '문제', '수정', '해결', '예외', '디버그', '핫픽스', '패치'
  ]),
  'architecture': new Set([
    'architecture', 'design', 'pattern', 'structure', 'modular', 'component', 'service',
    'layer', 'separation', 'coupling', 'cohesion', 'dependency', 'injection', 'inversion',
    'mvc', 'mvp', 'mvvm', 'redux', 'flux', 'microservice', 'monolith', 'scalable',
    '아키텍처', '설계', '구조', '모듈', '컴포넌트', '서비스', '계층', '의존성', '확장'
  ]),
  'testing': new Set([
    'test', 'testing', 'unit', 'integration', 'e2e', 'mock', 'stub', 'spy', 'jest', 'cypress',
    'coverage', 'assertion', 'expect', 'describe', 'it', 'should', 'spec', 'fixture',
    'snapshot', 'regression', 'qa', 'quality assurance',
    '테스트', '테스팅', '단위테스트', '통합테스트', '커버리지', '품질보증', '검증'
  ]),
  'documentation': new Set([
    'document', 'documentation', 'readme', 'comment', 'jsdoc', 'api', 'guide', 'tutorial',
    'example', 'sample', 'demo', 'explain', 'description', 'manual', 'wiki', 'changelog',
    '문서', '문서화', '주석', '설명', '가이드', '튜토리얼', '예제', '매뉴얼', '설명서'
  ]),
  'security': new Set([
    'security', 'secure', 'vulnerability', 'xss', 'csrf', 'sql injection', 'auth', 'authentication',
    'authorization', 'permission', 'role', 'token', 'jwt', 'oauth', 'encrypt', 'decrypt',
    'hash', 'salt', 'sanitize', 'validate', 'escape',
    '보안', '인증', '인가', '권한', '토큰', '암호화', '복호화', '검증', '취약점'
  ]),
  'ui-ux': new Set([
    'ui', 'ux', 'design', 'layout', 'style', 'css', 'responsive', 'mobile', 'desktop',
    'accessibility', 'a11y', 'usability', 'user experience', 'interface', 'interaction',
    'animation', 'transition', 'theme', 'color', 'font', 'typography', 'spacing',
    '사용자경험', '인터페이스', '디자인', '레이아웃', '스타일', '반응형', '접근성'
  ]),
  'general': new Set([]) // 기본 카테고리
};

/**
 * 텍스트에서 마크다운 및 HTML 태그 제거
 */
export function removeMarkdown(text: string): string {
  return text
    // 코드 블록 제거
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // 링크 제거 (텍스트만 남김)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // HTML 태그 제거
    .replace(/<[^>]*>/g, '')
    // 마크다운 문법 제거
    .replace(/[#*_~`]/g, '')
    // 특수 문자 정리
    .replace(/[^\w\s가-힣]/g, ' ')
    // 여러 공백을 하나로
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 텍스트를 토큰으로 분할 및 정규화
 */
export function tokenize(text: string): string[] {
  const cleanText = removeMarkdown(text).toLowerCase();
  
  // 단어 단위로 분할 (한글, 영어, 숫자 포함)
  const tokens = cleanText.match(/[\w가-힣]+/g) || [];
  
  // 불용어 제거 및 최소 길이 필터링
  return tokens.filter(token => {
    // 2글자 미만 제외
    if (token.length < 2) return false;
    
    // 불용어 제외
    if (KOREAN_STOPWORDS.has(token) || ENGLISH_STOPWORDS.has(token)) return false;
    
    // 숫자만으로 구성된 토큰 제외
    if (/^\d+$/.test(token)) return false;
    
    return true;
  });
}

/**
 * TF-IDF 계산을 위한 문서별 단어 빈도 계산
 */
export function calculateTermFrequency(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {};
  
  tokens.forEach(token => {
    tf[token] = (tf[token] || 0) + 1;
  });
  
  // 정규화 (문서 내 전체 토큰 수로 나눔)
  const totalTokens = tokens.length;
  Object.keys(tf).forEach(term => {
    tf[term] = tf[term] / totalTokens;
  });
  
  return tf;
}

/**
 * 역문서빈도(IDF) 계산
 */
export function calculateInverseDocumentFrequency(
  allDocuments: string[][], 
  term: string
): number {
  const documentsContainingTerm = allDocuments.filter(doc => doc.includes(term)).length;
  
  if (documentsContainingTerm === 0) return 0;
  
  return Math.log(allDocuments.length / documentsContainingTerm);
}

/**
 * 키워드를 카테고리로 분류
 */
export function categorizeKeyword(keyword: string): KeywordCategory {
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.has(keyword.toLowerCase())) {
      return category as KeywordCategory;
    }
  }
  return 'general';
}

/**
 * 키워드가 사용된 문맥 추출
 */
export function extractContexts(keyword: string, comments: string[], maxContexts = 3): string[] {
  const contexts: string[] = [];
  
  for (const comment of comments) {
    const lowerComment = comment.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerComment.includes(lowerKeyword) && contexts.length < maxContexts) {
      // 키워드 주변 50자 추출
      const index = lowerComment.indexOf(lowerKeyword);
      const start = Math.max(0, index - 25);
      const end = Math.min(comment.length, index + keyword.length + 25);
      
      let context = comment.substring(start, end).trim();
      
      // 앞뒤에 ... 추가
      if (start > 0) context = '...' + context;
      if (end < comment.length) context = context + '...';
      
      contexts.push(context);
    }
  }
  
  return contexts;
}

/**
 * 공통 구문 추출 (2-3 단어 조합)
 */
export function extractCommonPhrases(comments: string[], minFrequency = 2): { phrase: string; count: number }[] {
  const phrases: Record<string, number> = {};
  
  comments.forEach(comment => {
    const tokens = tokenize(comment);
    
    // 2-gram 생성
    for (let i = 0; i < tokens.length - 1; i++) {
      const phrase = `${tokens[i]} ${tokens[i + 1]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
    
    // 3-gram 생성
    for (let i = 0; i < tokens.length - 2; i++) {
      const phrase = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  });
  
  // 빈도 기준으로 필터링 및 정렬
  return Object.entries(phrases)
    .filter(([_, count]) => count >= minFrequency)
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // 상위 20개만
}

/**
 * 메인 텍스트 분석 함수
 */
export function analyzeText(comments: string[]): AnalysisResult {
  if (comments.length === 0) {
    return {
      keywords: [],
      categories: {} as Record<KeywordCategory, KeywordData[]>,
      totalWords: 0,
      uniqueWords: 0,
      averageWordsPerComment: 0,
      commonPhrases: []
    };
  }
  
  // 모든 코멘트를 토큰화
  const allTokenSets = comments.map(comment => tokenize(comment));
  const allTokens = allTokenSets.flat();
  
  // 전체 단어 통계
  const totalWords = allTokens.length;
  const uniqueWords = new Set(allTokens).size;
  const averageWordsPerComment = totalWords / comments.length;
  
  // 각 문서별 TF 계산
  const documentTFs = allTokenSets.map(tokens => calculateTermFrequency(tokens));
  
  // 모든 고유 단어에 대해 TF-IDF 계산
  const allUniqueTerms = new Set(allTokens);
  const keywordData: KeywordData[] = [];
  
  for (const term of allUniqueTerms) {
    // 전체 빈도 계산
    const frequency = allTokens.filter(token => token === term).length;
    
    // TF-IDF 계산 (모든 문서의 평균)
    let totalTFIDF = 0;
    const idf = calculateInverseDocumentFrequency(allTokenSets, term);
    
    documentTFs.forEach(tf => {
      const termTF = tf[term] || 0;
      totalTFIDF += termTF * idf;
    });
    
    const averageTFIDF = totalTFIDF / documentTFs.length;
    
    // 최소 빈도 및 TF-IDF 임계값 적용
    if (frequency >= 2 && averageTFIDF > 0.01) {
      const category = categorizeKeyword(term);
      const contexts = extractContexts(term, comments);
      
      keywordData.push({
        keyword: term,
        frequency,
        tfidf: averageTFIDF,
        category,
        contexts
      });
    }
  }
  
  // TF-IDF 기준으로 정렬 (상위 50개)
  const sortedKeywords = keywordData
    .sort((a, b) => b.tfidf - a.tfidf)
    .slice(0, 50);
  
  // 카테고리별 분류
  const categories: Record<KeywordCategory, KeywordData[]> = {
    'code-quality': [],
    'performance': [],
    'bug-fix': [],
    'architecture': [],
    'testing': [],
    'documentation': [],
    'security': [],
    'ui-ux': [],
    'general': []
  };
  
  sortedKeywords.forEach(keyword => {
    categories[keyword.category].push(keyword);
  });
  
  // 공통 구문 추출
  const commonPhrases = extractCommonPhrases(comments);
  
  return {
    keywords: sortedKeywords,
    categories,
    totalWords,
    uniqueWords,
    averageWordsPerComment,
    commonPhrases
  };
}