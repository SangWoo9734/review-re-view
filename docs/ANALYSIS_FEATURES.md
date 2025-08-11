# Review-Review 분석 기능 명세서

## 📋 개요

Review-Review는 GitHub Pull Request의 코드 리뷰 댓글을 분석하여 개발팀의 인사이트를 제공하는 도구입니다. 이 문서는 핵심 분석 로직과 기능 개선 방안을 정리합니다.

## 🎯 핵심 분석 기능

### 1. 코드 리뷰 키워드 분석 (CodeReviewKeywordAnalyzer)

#### 📊 분석 프로세스
```
PR 댓글 수집 → 키워드 사전 매칭 → 가중치 계산 → 카테고리 분류 → 결과 생성
```

#### 🔍 키워드 사전 구조
```typescript
{
  technical_issues: {
    keywords: ['메모리누수', 'performance issue', 'security vulnerability', ...],
    weight: 3.0,      // 높은 가중치 (심각한 이슈)
    category: 'critical'
  },
  code_quality: {
    keywords: ['리팩토링', 'readability', '유지보수성', ...],
    weight: 2.5,      // 중간 가중치
    category: 'quality'
  },
  // ... 다른 카테고리들
}
```

#### ⚖️ 점수 계산 알고리즘
```typescript
finalScore = baseFrequency × categoryWeight × contextBonus

// contextBonus: 키워드가 나타나는 문맥의 중요도
// - 제목에 나타나면 +0.5
// - 강조 표현과 함께 나타나면 +0.3
// - 코드 블록 내에 나타나면 +0.2
```

#### 📈 현재 카테고리
1. **Critical (빨간색)** - 기술적 이슈, 보안 문제
2. **Quality (주황색)** - 코드 품질, 리팩토링
3. **Performance (노란색)** - 성능 최적화
4. **Architecture (파란색)** - 설계, 아키텍처
5. **Testing (초록색)** - 테스트 관련

### 2. 워드클라우드 생성 (WordCloud)

#### 🎨 시각화 알고리즘
```typescript
// 1. 키워드 점수 정규화
normalizedScore = keyword.finalScore / maxScore

// 2. 크기 계산 (14-48px)
fontSize = 14 + (normalizedScore × 34)

// 3. 태그 스타일 레이아웃
- 둥근 태그 형태로 표시
- 카테고리별 색상 적용
- 가로 방향 플로우 레이아웃
```

#### 🎯 특징
- **태그 클라우드 스타일**: 기존 원형 워드클라우드 대신 읽기 쉬운 태그 형태
- **인터랙티브**: 호버 시 확대, 클릭 이벤트 지원
- **카테고리 필터링**: 특정 카테고리만 표시 가능
- **툴팁**: 빈도수, 중요도, 카테고리 정보 표시

### 3. 액션 아이템 생성 (Action Items)

#### 🎯 생성 로직
```
분석결과 → 카테고리별 집계 → 패턴 매칭 → 우선순위 계산 → 액션아이템 생성
```

#### 📋 액션 아이템 구조
```typescript
interface ActionItem {
  id: string;
  title: string;           // "성능 최적화 검토"
  description: string;     // 구체적인 설명
  priority: 'P1' | 'P2' | 'P3';  // 우선순위
  category: 'immediate' | 'improvement' | 'consideration';
  keywordCategory: string; // 원본 키워드 카테고리
  relatedKeywords: string[]; // 관련 키워드들
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}
```

#### ⚡ 우선순위 계산
```typescript
// 기본 우선순위 + 빈도 기반 조정
if (frequency >= 10) return 'P1';        // 높은 빈도
if (frequency >= 5) return basePriority;  // 중간 빈도  
return basePriority;                      // 낮은 빈도
```

## 🔧 현재 한계점 및 개선 방안

### 1. 키워드 사전의 한계
**현재 문제:**
- 하드코딩된 키워드 사전
- 프로젝트별 맞춤화 불가
- 새로운 기술 스택 반영 어려움

**개선 방안:**
```typescript
// 1. 동적 키워드 학습 시스템
interface KeywordLearningSystem {
  learnFromProject(comments: string[], techStack: string[]): void;
  updateWeights(feedback: UserFeedback[]): void;
  suggestNewKeywords(): string[];
}

// 2. 기술 스택별 키워드 세트
const TECH_SPECIFIC_KEYWORDS = {
  'React': ['hook', 'state', 'props', 'render', 'component'],
  'TypeScript': ['type', 'interface', 'generic', 'union'],
  'Node.js': ['async', 'callback', 'stream', 'middleware']
};
```

### 2. 문맥 분석의 부족
**현재 문제:**
- 단순 키워드 매칭
- 긍정/부정 톤 구분 불가
- 문장 구조 분석 부족

**개선 방안:**
```typescript
// 감정/톤 분석 추가
interface SentimentAnalysis {
  tone: 'positive' | 'negative' | 'neutral';
  confidence: number;
  context: 'praise' | 'concern' | 'suggestion' | 'question';
}

// 예: "성능이 좋아졌다" vs "성능이 문제다"
```

### 3. 액션 아이템의 구체성 부족
**현재 문제:**
- 템플릿 기반의 일반적인 내용
- 실제 코드 위치 정보 부족
- 해결 방법 제시 미흡

**개선 방안:**
```typescript
// 코드 위치 추적
interface CodeLocation {
  file: string;
  lineNumber: number;
  function: string;
  context: string;
}

// 구체적인 해결책 제시
interface ActionSolution {
  steps: string[];
  codeExample: string;
  resources: string[];
  estimatedTime: string;
}
```

## 🚀 추천 개선사항

### Phase 1: 즉시 적용 가능 (1-2주)
1. **키워드 사전 확장**
   - 더 많은 기술 키워드 추가
   - 한국어/영어 동의어 매핑 강화

2. **워드클라우드 UX 개선**
   - 카테고리별 필터 UI 개선
   - 키워드 상세 정보 팝업 추가

### Phase 2: 중기 개선 (1개월)
1. **스마트 분석 도입**
   - TF-IDF 기반 키워드 중요도 계산
   - 프로젝트별 키워드 가중치 조정

2. **액션 아이템 고도화**
   - 우선순위 알고리즘 개선
   - 실행 가능한 구체적 액션 제시

### Phase 3: 장기 비전 (2-3개월)
1. **AI 기반 분석**
   - GPT API 연동으로 문맥 이해도 향상
   - 자동 요약 및 인사이트 생성

2. **팀 맞춤형 기능**
   - 팀별 코드 리뷰 패턴 학습
   - 개인별 리뷰 스타일 분석

## 📊 성능 지표

### 현재 처리 능력
- **키워드 분석**: ~1,000 댓글/초
- **워드클라우드 생성**: ~100ms
- **액션 아이템 생성**: ~200ms

### 메모리 사용량
- **키워드 사전**: ~50KB
- **분석 결과**: ~댓글 수 × 0.5KB
- **워드클라우드 데이터**: ~키워드 수 × 0.1KB

## 🔗 관련 파일

- **핵심 분석**: `lib/services/codeReviewKeywordAnalyzer.ts`
- **워드클라우드**: `hooks/useWordCloud.ts`, `lib/services/wordCloudService.ts`
- **액션 아이템**: `hooks/useActionItems.ts`, `lib/actionItems.ts`
- **UI 컴포넌트**: `components/features/WordCloud.tsx`, `components/features/ActionItemCard.tsx`

---

*이 문서는 Review-Review의 핵심 분석 기능을 설명하며, 지속적인 개선을 위한 로드맵을 제시합니다.*