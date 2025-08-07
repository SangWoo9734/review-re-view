# 🔧 코드베이스 관심사 분리 리팩토링 분석

## 📊 현황 분석 - 관심사 분리 관점

### 현재 코드베이스의 관심사 혼재 문제

**문제:** UI 로직, API 로직, 비즈니스 로직, 유틸리티가 섞여있어 코드의 책임이 불분명

### 관심사 분류 기준:
- **🎨 UI 로직**: 컴포넌트 렌더링, 이벤트 핸들링, 상태 관리
- **🌐 API 로직**: HTTP 요청, 응답 처리, 에러 핸들링
- **⚙️ 비즈니스 로직**: 도메인 규칙, 데이터 변환, 계산 로직
- **🔧 유틸리티**: 순수 함수, 헬퍼, 상수, 타입

## 🚨 관심사 분리 위반 사례 분석

### Priority 1: 심각한 관심사 혼재

#### 1. **app/results/page.tsx** (529줄) - 🚨 UI + 비즈니스 + 유틸리티 혼재
**현재 문제점:**
```tsx
// 🎨 UI 로직 (탭 관리, 렌더링)
const [activeTab, setActiveTab] = useState<TabType>('wordcloud');

// ⚙️ 비즈니스 로직 (데이터 변환)  
const totalComments = analyzedPRs.reduce((acc, pr) => acc + (pr.commentCount || 0), 0) || 47;

// 🌐 API 로직 (세션 스토리지)
const storedResult = sessionStorage.getItem('analysisResult');

// 🔧 유틸리티 (카테고리 매핑)
{category === 'code-quality' ? '🧹 코드품질' : 
 category === 'performance' ? '⚡ 성능' : '📝 일반'}
```

**리팩토링 계획:**
```
📁 results/
├── 🎨 UI 레이어
│   ├── page.tsx (컴포넌트 조합만)
│   └── components/ (순수 UI 컴포넌트)
├── ⚙️ 비즈니스 레이어  
│   ├── services/
│   │   ├── resultsCalculator.ts (통계 계산)
│   │   └── dataProcessor.ts (데이터 변환)
├── 🌐 API 레이어
│   └── api/
│       └── resultsStorage.ts (세션 관리)
└── 🔧 유틸리티 레이어
    └── utils/
        ├── categoryMapper.ts (카테고리 변환)
        └── constants.ts (상수)
```

#### 2. **lib/textAnalysis.ts** (345줄) - 🚨 비즈니스 + 유틸리티 + 상수 혼재
**현재 문제점:**
```ts
// 🔧 유틸리티 (상수)
const KOREAN_STOPWORDS = new Set([...40줄...]); 
const ENGLISH_STOPWORDS = new Set([...20줄...]);

// ⚙️ 비즈니스 로직 (TF-IDF 계산)
function calculateTFIDF(documents: string[][], keywords: Map<string, number>) {
  // 복잡한 계산 로직 50줄...
}

// ⚙️ 비즈니스 로직 (카테고리 분류)
function categorizeKeywords(keywords: KeywordData[]): Record<KeywordCategory, KeywordData[]> {
  // 분류 로직 100줄...
}
```

**리팩토링 계획:**
```
📁 lib/textAnalysis/
├── ⚙️ 비즈니스 레이어
│   ├── services/
│   │   ├── tfidfCalculator.ts (TF-IDF 계산 순수 함수)
│   │   ├── keywordCategorizer.ts (카테고리 분류)
│   │   └── textProcessor.ts (전처리)
├── 🔧 유틸리티 레이어
│   ├── constants/
│   │   ├── stopwords.ts (불용어 상수)
│   │   └── categoryPatterns.ts (패턴 정의)
│   └── helpers/
│       └── textUtils.ts (텍스트 헬퍼 함수)
└── index.ts (공개 API만)
```

#### 3. **hooks/useGitHub.ts + lib/github.ts** - 🚨 API + 비즈니스 혼재
**현재 문제점:**
```ts
// useGitHub.ts에서 🌐 API + ⚙️ 비즈니스 혼재
return useQuery({
  queryKey: ['repositories', { search, page, perPage, sort }],
  queryFn: async (): Promise<{ repositories: Repository[]; total?: number }> => {
    // HTTP 요청 (API 로직)
    const response = await fetch(`/api/github/repositories?${params}`);
    
    // 데이터 변환 (비즈니스 로직)  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch repositories');
    }
  }
});
```

**리팩토링 계획:**
```
📁 github/
├── 🌐 API 레이어 
│   ├── api/
│   │   ├── githubApi.ts (순수 HTTP 클라이언트)
│   │   └── endpoints.ts (엔드포인트 정의)
├── ⚙️ 비즈니스 레이어
│   ├── services/
│   │   ├── repositoryService.ts (레포지토리 비즈니스 로직)
│   │   └── pullRequestService.ts (PR 비즈니스 로직)  
└── 🎨 UI 레이어
    └── hooks/
        ├── useRepositories.ts (UI 상태 관리만)
        └── usePullRequests.ts
```

## 🚀 관심사 분리 실행 계획

### Phase 1: 유틸리티 레이어 분리 (가장 쉽고 안전)

#### 1.1. 상수 및 타입 분리
```bash
# 현재: 여러 파일에 산재
app/results/page.tsx → 카테고리 매핑 로직
lib/textAnalysis.ts → 불용어, 패턴 상수
lib/actionItems.ts → 액션 패턴 상수

# 개선: 중앙 집중화
lib/constants/
├── categories.ts     # 카테고리 매핑
├── stopwords.ts      # 불용어 리스트  
├── patterns.ts       # 분석 패턴
└── actionPatterns.ts # 액션 패턴
```

#### 1.2. 순수 함수 유틸리티 분리
```bash
lib/utils/
├── textHelpers.ts    # 텍스트 조작 함수
├── calculators.ts    # 통계 계산 함수
├── formatters.ts     # 데이터 포맷팅
└── validators.ts     # 검증 함수
```

### Phase 2: API 레이어 분리

#### 2.1. HTTP 클라이언트 순수화
```bash
# 현재: hooks에서 직접 fetch
hooks/useGitHub.ts → fetch 호출 + 에러 처리 + 데이터 변환

# 개선: 레이어 분리
lib/api/
├── httpClient.ts     # 순수 HTTP 클라이언트
├── githubApi.ts      # GitHub API 엔드포인트
└── errorHandler.ts   # API 에러 처리
```

### Phase 3: 비즈니스 로직 분리

#### 3.1. 도메인 서비스 분리  
```bash
lib/services/
├── textAnalysisService.ts    # 텍스트 분석 비즈니스 로직
├── actionItemService.ts      # 액션 아이템 생성 로직
├── repositoryService.ts      # 레포지토리 관리 로직
└── statisticsService.ts      # 통계 계산 로직
```

### Phase 4: UI 레이어 순수화

#### 4.1. 컴포넌트에서 비즈니스 로직 제거
```tsx
// 현재: UI 컴포넌트에 비즈니스 로직 혼재
const totalComments = analyzedPRs.reduce((acc, pr) => acc + (pr.commentCount || 0), 0);

// 개선: 서비스 레이어로 분리  
const totalComments = statisticsService.calculateTotalComments(analyzedPRs);
```

---

## ✅ 구체적 실행 순서

### 1단계: 상수 분리 (30분)
- [ ] `lib/constants/categories.ts` 생성
- [ ] `lib/constants/stopwords.ts` 생성  
- [ ] 기존 파일들에서 상수 import로 변경

### 2단계: 유틸리티 함수 분리 (1시간)
- [ ] `lib/utils/calculators.ts` 생성
- [ ] `lib/utils/formatters.ts` 생성
- [ ] 통계 계산 로직을 순수 함수로 추출

### 3단계: API 클라이언트 분리 (1시간)  
- [ ] `lib/api/githubApi.ts` 생성
- [ ] hooks에서 HTTP 로직 분리
- [ ] 에러 처리 중앙화

### 4단계: 비즈니스 서비스 분리 (2시간)
- [ ] `lib/services/textAnalysisService.ts` 생성
- [ ] 복잡한 계산 로직을 서비스로 이동
- [ ] 컴포넌트에서 서비스 호출로 변경

### 5단계: 검증 및 테스트 (30분)
- [ ] 빌드 에러 확인
- [ ] 기능 동작 테스트
- [ ] 성능 영향 측정

---

## 🎯 예상 효과

### 관심사 분리 완료 후 구조:
```
📁 프로젝트 루트/
├── 🎨 app/ (UI 레이어 - 컴포넌트 조합만)
│   ├── results/page.tsx (~100줄, UI 로직만)
│   └── dashboard/page.tsx (~150줄, UI 로직만)
├── 🌐 lib/api/ (API 레이어 - HTTP 통신만)
│   ├── githubApi.ts 
│   └── httpClient.ts
├── ⚙️ lib/services/ (비즈니스 레이어 - 도메인 로직)
│   ├── textAnalysisService.ts
│   ├── statisticsService.ts
│   └── actionItemService.ts
└── 🔧 lib/utils/ (유틸리티 레이어 - 순수 함수)
    ├── constants/
    ├── calculators.ts
    └── formatters.ts
```

### 개선 효과:
- **🧪 테스트 용이성**: 각 레이어를 독립적으로 테스트 가능
- **🔧 유지보수성**: 문제 발생 시 해당 레이어만 수정
- **♻️ 재사용성**: 유틸리티와 서비스 로직 재사용 가능  
- **📖 가독성**: 파일별 책임이 명확해짐
- **🚀 확장성**: 새 기능 추가 시 적절한 레이어에 배치

---

## 🚀 다음 단계

**1단계 상수 분리부터 시작하는 것을 권장합니다.**

이 리팩토링을 통해 Review-Review 코드베이스가 **관심사별로 명확히 분리된 유지보수 가능한 구조**로 발전할 수 있습니다.
