// 🔧 유틸리티 레이어 - 카테고리 관련 상수
// 관심사: UI 표시용 카테고리 매핑 및 스타일 정의

import { KeywordCategory } from '@/lib/textAnalysis';
import type { ChipVariant } from '@/components/ui/Chip';

// 카테고리별 한글 레이블 (짧은 버전)
export const CATEGORY_LABELS_SHORT: Record<KeywordCategory, string> = {
  'code-quality': '코드품질',
  'performance': '성능', 
  'bug-fix': '버그수정',
  'architecture': '아키텍처',
  'testing': '테스트',
  'documentation': '문서화',
  'security': '보안',
  'ui-ux': 'UI/UX',
  'general': '일반'
};

// 카테고리별 한글 레이블 (아이콘 포함 버전)
export const CATEGORY_LABELS_WITH_ICONS: Record<KeywordCategory, string> = {
  'code-quality': '🧹 코드 품질',
  'performance': '⚡ 성능',
  'bug-fix': '🐛 버그 수정', 
  'architecture': '🏗️ 아키텍처',
  'testing': '🧪 테스트',
  'documentation': '📚 문서화',
  'security': '🔒 보안',
  'ui-ux': '🎨 UI/UX',
  'general': '📝 일반'
};

// 사이드바용 카테고리 레이블 (짧은 아이콘 버전)
export const CATEGORY_LABELS_SIDEBAR: Record<KeywordCategory, string> = {
  'code-quality': '🧹 코드품질',
  'performance': '⚡ 성능',
  'bug-fix': '🐛 버그수정',
  'architecture': '🏗️ 아키텍처', 
  'testing': '🧪 테스트',
  'documentation': '📚 문서화',
  'security': '🔒 보안',
  'ui-ux': '🎨 UI/UX',
  'general': '📝 일반'
};

// 카테고리별 Chip 컴포넌트 색상 변형
export const CATEGORY_CHIP_VARIANTS: Record<KeywordCategory, ChipVariant> = {
  'code-quality': 'info',
  'performance': 'warning', 
  'bug-fix': 'error',
  'architecture': 'default',
  'testing': 'success',
  'documentation': 'default',
  'security': 'error',
  'ui-ux': 'info',
  'general': 'default'
};

// 카테고리별 색상 (CSS 클래스명 또는 색상값)
export const CATEGORY_COLORS: Record<KeywordCategory, string> = {
  'code-quality': '#3b82f6',  // 파란색
  'performance': '#f59e0b',   // 노란색
  'bug-fix': '#ef4444',       // 빨간색
  'architecture': '#8b5cf6',  // 보라색
  'testing': '#10b981',       // 초록색
  'documentation': '#6b7280', // 회색
  'security': '#dc2626',      // 진한 빨간색
  'ui-ux': '#06b6d4',        // 청록색
  'general': '#64748b'        // 슬레이트 회색
};

// 헬퍼 함수들
export const getCategoryLabel = (category: KeywordCategory, withIcon: boolean = false): string => {
  return withIcon 
    ? CATEGORY_LABELS_WITH_ICONS[category] 
    : CATEGORY_LABELS_SHORT[category];
};

export const getCategoryChipVariant = (category: KeywordCategory): ChipVariant => {
  return CATEGORY_CHIP_VARIANTS[category];
};

export const getCategoryColor = (category: KeywordCategory): string => {
  return CATEGORY_COLORS[category];
};