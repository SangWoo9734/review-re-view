// 🔧 유틸리티 레이어 - 액션 아이템 패턴 상수
// 관심사: 키워드 기반 액션 아이템 생성 패턴 정의

import type { ActionItem } from '@/lib/actionItems';

// 키워드 기반 액션 아이템 패턴 정의
export const ACTION_PATTERNS: Record<string, {
  keywords: string[];
  actions: Omit<ActionItem, 'id' | 'relatedKeywords'>[];
}> = {
  'code-quality': {
    keywords: ['refactor', 'clean', 'naming', 'structure', 'readable', 'maintainable', 'improve'],
    actions: [
      {
        title: '코드 리팩토링 및 구조 개선',
        description: '코드의 가독성과 유지보수성을 높이기 위한 리팩토링이 필요합니다.',
        priority: 'P2',
        category: 'improvement',
        keywordCategory: 'code-quality',
        impact: 'high',
        effort: 'medium',
        examples: [
          '함수나 변수명을 더 명확하게 변경',
          '중복 코드를 공통 함수로 추출',
          '복잡한 조건문을 단순화'
        ]
      },
      {
        title: '네이밍 컨벤션 통일',
        description: '일관된 네이밍 컨벤션을 적용하여 코드의 일관성을 개선하세요.',
        priority: 'P3',
        category: 'consideration',
        keywordCategory: 'code-quality',
        impact: 'medium',
        effort: 'low',
        examples: [
          'camelCase 또는 snake_case 통일',
          '의미있는 변수명 사용',
          '약어 사용 규칙 정립'
        ]
      }
    ]
  },
  'performance': {
    keywords: ['performance', 'optimize', 'slow', 'fast', 'memory', 'lazy', 'async', 'cache'],
    actions: [
      {
        title: '성능 최적화 필요',
        description: '애플리케이션의 성능 병목 지점을 식별하고 최적화가 필요합니다.',
        priority: 'P1',
        category: 'immediate',
        keywordCategory: 'performance',
        impact: 'high',
        effort: 'high',
        examples: [
          '불필요한 리렌더링 방지 (React.memo, useMemo)',
          '이미지 최적화 및 레이지 로딩',
          'API 호출 최적화 (캐싱, 배치 처리)'
        ]
      },
      {
        title: '메모리 사용량 최적화',
        description: '메모리 누수를 방지하고 효율적인 메모리 사용을 구현하세요.',
        priority: 'P2',
        category: 'improvement',
        keywordCategory: 'performance',
        impact: 'medium',
        effort: 'medium',
        examples: [
          'useEffect cleanup 함수 구현',
          '큰 데이터셋 가상화 (virtual scrolling)',
          '불필요한 상태 제거'
        ]
      }
    ]
  },
  'bug-fix': {
    keywords: ['bug', 'fix', 'error', 'issue', 'exception', 'null', 'undefined', 'crash'],
    actions: [
      {
        title: '버그 수정 및 에러 핸들링 강화',
        description: '발견된 버그들을 수정하고 에러 핸들링을 강화해야 합니다.',
        priority: 'P1',
        category: 'immediate',
        keywordCategory: 'bug-fix',
        impact: 'high',
        effort: 'medium',
        examples: [
          'try-catch 블록으로 예외 처리',
          'null/undefined 체크 강화',
          '에러 바운더리 구현'
        ]
      },
      {
        title: '엣지 케이스 대응',
        description: '예상치 못한 상황에 대한 예외 처리를 추가하세요.',
        priority: 'P2',
        category: 'improvement',
        keywordCategory: 'bug-fix',
        impact: 'medium',
        effort: 'low',
        examples: [
          '빈 배열이나 객체 처리',
          '네트워크 에러 처리',
          '사용자 입력 검증 강화'
        ]
      }
    ]
  },
  'testing': {
    keywords: ['test', 'testing', 'unit', 'integration', 'coverage', 'mock', 'spec'],
    actions: [
      {
        title: '테스트 커버리지 향상',
        description: '코드 품질 보장을 위해 테스트 커버리지를 높이세요.',
        priority: 'P2',
        category: 'improvement',
        keywordCategory: 'testing',
        impact: 'high',
        effort: 'high',
        examples: [
          '단위 테스트 추가 작성',
          '통합 테스트 구현',
          '테스트 자동화 파이프라인 구축'
        ]
      }
    ]
  },
  'security': {
    keywords: ['security', 'auth', 'token', 'encrypt', 'validation', 'sanitize', 'xss', 'csrf'],
    actions: [
      {
        title: '보안 강화 필요',
        description: '보안 취약점을 해결하고 보안 정책을 강화하세요.',
        priority: 'P1',
        category: 'immediate',
        keywordCategory: 'security',
        impact: 'high',
        effort: 'medium',
        examples: [
          '입력값 검증 및 새니타이징',
          'HTTPS 사용 강제',
          '민감한 정보 암호화'
        ]
      }
    ]
  },
  'architecture': {
    keywords: ['architecture', 'structure', 'modular', 'dependency', 'coupling', 'separation'],
    actions: [
      {
        title: '아키텍처 개선',
        description: '시스템 아키텍처를 개선하여 확장성과 유지보수성을 높이세요.',
        priority: 'P2',
        category: 'improvement',
        keywordCategory: 'architecture',
        impact: 'high',
        effort: 'high',
        examples: [
          '모듈간 결합도 낮추기',
          '관심사 분리 적용',
          '의존성 주입 패턴 활용'
        ]
      }
    ]
  },
  'ui-ux': {
    keywords: ['ui', 'ux', 'design', 'responsive', 'accessibility', 'usability', 'interaction'],
    actions: [
      {
        title: 'UI/UX 개선',
        description: '사용자 경험을 향상시키기 위한 UI/UX 개선이 필요합니다.',
        priority: 'P3',
        category: 'consideration',
        keywordCategory: 'ui-ux',
        impact: 'medium',
        effort: 'medium',
        examples: [
          '접근성(a11y) 가이드라인 준수',
          '반응형 디자인 최적화',
          '사용자 피드백 개선'
        ]
      }
    ]
  },
  'documentation': {
    keywords: ['document', 'comment', 'readme', 'guide', 'explain', 'description'],
    actions: [
      {
        title: '문서화 개선',
        description: '코드와 프로젝트의 문서화를 개선하여 협업 효율을 높이세요.',
        priority: 'P3',
        category: 'consideration',
        keywordCategory: 'documentation',
        impact: 'medium',
        effort: 'low',
        examples: [
          'README.md 업데이트',
          '함수별 JSDoc 주석 추가',
          'API 문서 작성'
        ]
      }
    ]
  }
};