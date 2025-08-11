/**
 * 코드 리뷰 도메인 특화 키워드 분석 서비스
 * MVP용 로컬 기반 분석 시스템
 */

// 코드 리뷰 도메인 특화 키워드 사전
export const CODE_REVIEW_DICTIONARY = {
  // 기술적 이슈 (높은 가중치)
  technical_issues: {
    keywords: [
      '메모리누수', '메모리 누수', 'memory leak',
      '성능문제', '성능 문제', 'performance issue',
      '보안취약점', '보안 취약점', 'security vulnerability',
      '타입안전성', '타입 안전성', 'type safety',
      '예외처리', '예외 처리', 'exception handling',
      'null체크', 'null 체크', 'null check',
      '무한루프', '무한 루프', 'infinite loop',
      '데드락', 'deadlock', '교착상태',
      '레이스컨디션', 'race condition',
      '스택오버플로우', 'stack overflow'
    ],
    weight: 3.0,
    category: 'critical'
  },

  // 코드 품질
  code_quality: {
    keywords: [
      '리팩토링', 'refactoring', '구조개선', '구조 개선',
      '가독성', 'readability', '코드품질', '코드 품질',
      '유지보수', '유지보수성', 'maintainability',
      '재사용성', 'reusability', '모듈화', 'modularity',
      '중복코드', '중복 코드', 'duplicate code',
      '복잡도', 'complexity', '사이클복잡도',
      '네이밍', 'naming', '변수명', '함수명',
      '주석', 'comment', '문서화', 'documentation'
    ],
    weight: 2.5,
    category: 'quality'
  },

  // 아키텍처 및 설계
  architecture: {
    keywords: [
      '아키텍처', 'architecture', '설계패턴', '디자인패턴',
      '의존성', 'dependency', '결합도', 'coupling',
      '응집도', 'cohesion', '단일책임', 'single responsibility',
      '인터페이스', 'interface', '추상화', 'abstraction',
      '캡슐화', 'encapsulation', '상속', 'inheritance',
      '컴포지션', 'composition', 'SOLID', 'DRY',
      '관심사분리', '관심사 분리', 'separation of concerns'
    ],
    weight: 2.3,
    category: 'architecture'
  },

  // 테스트 관련
  testing: {
    keywords: [
      '테스트', 'test', '단위테스트', 'unit test',
      '통합테스트', 'integration test', 'e2e', 'end-to-end',
      '테스트커버리지', 'test coverage', '목킹', 'mocking',
      '테스트케이스', 'test case', 'TDD', 'BDD',
      '검증', 'validation', '테스트코드',
      '자동화테스트', '회귀테스트', 'regression test'
    ],
    weight: 2.2,
    category: 'testing'
  },

  // 성능 최적화
  performance: {
    keywords: [
      '성능최적화', '성능 최적화', 'optimization',
      '렌더링', 'rendering', '메모이제이션', 'memoization',
      '레이지로딩', 'lazy loading', '번들사이즈', 'bundle size',
      '캐싱', 'caching', '압축', 'compression',
      '로딩시간', '로딩 시간', 'loading time',
      '반응시간', '응답시간', 'response time',
      'CDN', '이미지최적화', '코드분할', 'code splitting'
    ],
    weight: 2.4,
    category: 'performance'
  },

  // 보안
  security: {
    keywords: [
      '보안', 'security', 'XSS', 'CSRF', 'SQL인젝션',
      '인증', 'authentication', '인가', 'authorization',
      '암호화', 'encryption', '해싱', 'hashing',
      '토큰', 'token', 'JWT', '세션', 'session',
      '민감정보', '개인정보', 'sensitive data',
      '권한체크', '권한 체크', '입력검증', '입력 검증'
    ],
    weight: 3.0,
    category: 'security'
  },

  // 리뷰 액션 (긍정적)
  positive_actions: {
    keywords: [
      'LGTM', '좋아요', '좋습니다', '훌륭합니다', '완벽합니다',
      '깔끔합니다', '잘했습니다', '멋집니다', '우수합니다',
      '개선되었습니다', '효율적입니다', '적절합니다'
    ],
    weight: 1.5,
    category: 'positive'
  },

  // 리뷰 액션 (개선 요청)
  improvement_requests: {
    keywords: [
      '수정', '변경', '개선', '보완', '추가',
      '제거', '삭제', '확인', '검토', '고려',
      '권장', '추천', '제안', '조정', '업데이트'
    ],
    weight: 2.0,
    category: 'improvement'
  },

  // 기술 스택 (React/TypeScript 중심)
  tech_stack: {
    keywords: [
      'React', 'TypeScript', 'JavaScript', 'useState', 'useEffect',
      'useCallback', 'useMemo', 'useContext', 'useReducer',
      'props', 'state', 'component', 'hook', 'JSX',
      'async', 'await', 'Promise', 'fetch', 'API',
      'CSS', 'Tailwind', 'styled-components',
      'Next.js', 'Redux', 'Zustand', 'SWR', 'React Query'
    ],
    weight: 1.8,
    category: 'tech'
  }
};

// 감정 분석을 위한 패턴
export const SENTIMENT_PATTERNS = {
  // 강한 부정 (높은 가중치)
  strong_negative: {
    patterns: [
      /문제가?\s*있습니다/gi,
      /잘못되었습니다/gi,
      /심각합니다/gi,
      /위험합니다/gi,
      /버그입니다/gi,
      /오류입니다/gi,
      /fix.*needed/gi,
      /critical.*issue/gi,
      /major.*problem/gi
    ],
    multiplier: 2.5
  },

  // 중간 부정 
  moderate_negative: {
    patterns: [
      /개선이?\s*필요합니다/gi,
      /수정해?\s*주세요/gi,
      /변경해?\s*주세요/gi,
      /확인해?\s*주세요/gi,
      /고려해?\s*주세요/gi,
      /should.*fix/gi,
      /needs.*improvement/gi,
      /consider.*changing/gi
    ],
    multiplier: 1.8
  },

  // 긍정적
  positive: {
    patterns: [
      /좋습니다/gi,
      /훌륭합니다/gi,
      /완벽합니다/gi,
      /깔끔합니다/gi,
      /멋집니다/gi,
      /LGTM/gi,
      /looks.*good/gi,
      /great.*work/gi,
      /perfect/gi,
      /excellent/gi
    ],
    multiplier: 1.2
  },

  // 제안/권장 (중립적)
  suggestions: {
    patterns: [
      /제안합니다/gi,
      /권장합니다/gi,
      /추천합니다/gi,
      /어떨까요/gi,
      /생각해보세요/gi,
      /suggest/gi,
      /recommend/gi,
      /how.*about/gi,
      /might.*want/gi
    ],
    multiplier: 1.5
  }
};

export interface CodeReviewKeyword {
  text: string;
  frequency: number;
  weight: number;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'suggestion';
  finalScore: number;
}

export class CodeReviewKeywordAnalyzer {
  /**
   * 텍스트에서 코드 리뷰 관련 키워드를 추출하고 분석
   */
  static analyzeText(text: string): CodeReviewKeyword[] {
    const keywordMap = new Map<string, {
      frequency: number;
      weight: number;
      category: string;
      contexts: string[];
    }>();

    // 1. 도메인 특화 키워드 추출
    Object.entries(CODE_REVIEW_DICTIONARY).forEach(([_, dictEntry]) => {
      dictEntry.keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = text.match(regex);
        
        if (matches) {
          const normalizedKeyword = keyword.toLowerCase();
          const existing = keywordMap.get(normalizedKeyword);
          
          if (existing) {
            existing.frequency += matches.length;
          } else {
            keywordMap.set(normalizedKeyword, {
              frequency: matches.length,
              weight: dictEntry.weight,
              category: dictEntry.category,
              contexts: []
            });
          }
        }
      });
    });

    // 2. 각 키워드의 맥락 분석 및 감정 점수 계산
    const results: CodeReviewKeyword[] = [];
    
    keywordMap.forEach((data, keyword) => {
      const contextSentiment = this.analyzeSentiment(text, keyword);
      const finalScore = data.frequency * data.weight * contextSentiment.multiplier;
      
      results.push({
        text: keyword,
        frequency: data.frequency,
        weight: data.weight,
        category: data.category,
        sentiment: contextSentiment.sentiment,
        finalScore: finalScore
      });
    });

    // 3. 점수순으로 정렬하고 상위 결과만 반환
    return results
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 30); // 상위 30개만
  }

  /**
   * 키워드 주변 맥락을 분석하여 감정 점수 계산
   */
  private static analyzeSentiment(text: string, keyword: string): {
    sentiment: 'positive' | 'negative' | 'neutral' | 'suggestion';
    multiplier: number;
  } {
    // 키워드 주변 50자 정도의 맥락 추출
    const keywordRegex = new RegExp(keyword, 'gi');
    const match = text.match(keywordRegex);
    
    if (!match) {
      return { sentiment: 'neutral', multiplier: 1.0 };
    }

    const index = text.search(keywordRegex);
    const contextStart = Math.max(0, index - 50);
    const contextEnd = Math.min(text.length, index + keyword.length + 50);
    const context = text.substring(contextStart, contextEnd);

    // 감정 패턴 매칭
    for (const [sentimentType, config] of Object.entries(SENTIMENT_PATTERNS)) {
      for (const pattern of config.patterns) {
        if (pattern.test(context)) {
          let sentiment: 'positive' | 'negative' | 'neutral' | 'suggestion';
          
          if (sentimentType.includes('negative')) {
            sentiment = 'negative';
          } else if (sentimentType === 'positive') {
            sentiment = 'positive';
          } else if (sentimentType === 'suggestions') {
            sentiment = 'suggestion';
          } else {
            sentiment = 'neutral';
          }
          
          return {
            sentiment,
            multiplier: config.multiplier
          };
        }
      }
    }

    return { sentiment: 'neutral', multiplier: 1.0 };
  }

  /**
   * 카테고리별 색상 매핑
   */
  static getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
      critical: '#ef4444',      // 빨강 - 심각한 이슈
      security: '#dc2626',      // 진한 빨강 - 보안
      quality: '#3b82f6',       // 파랑 - 코드 품질
      performance: '#f59e0b',   // 주황 - 성능
      architecture: '#8b5cf6',  // 보라 - 아키텍처
      testing: '#10b981',       // 초록 - 테스트
      improvement: '#06b6d4',   // 청록 - 개선사항
      positive: '#22c55e',      // 연두 - 긍정적
      tech: '#6b7280',          // 회색 - 기술스택
      general: '#9ca3af'        // 연회색 - 일반
    };
    
    return colorMap[category] || colorMap.general;
  }
}