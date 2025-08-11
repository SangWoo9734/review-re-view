// 🏢 비즈니스 로직 레이어 - PR 표시 도메인 서비스
// 관심사: PR 상태 표시, 날짜 포맷팅, 정렬 로직

import type { PullRequest } from '@/types/github';
import type { ChipVariant } from '@/components/ui/Chip';

/**
 * PR 상태 설정
 */
interface PRStateConfig {
  variant: ChipVariant;
  label: string;
  priority: number;
  iconEmoji: string;
}

/**
 * PR 표시 메타데이터
 */
export interface PRDisplayMetadata {
  formattedDate: string;
  relativeTime: string;
  stateConfig: PRStateConfig;
  commentsSummary: string;
  urgencyLevel: 'high' | 'medium' | 'low';
}

/**
 * PR 정렬 옵션
 */
export type PRSortOption = 
  | 'updated-desc' 
  | 'updated-asc' 
  | 'created-desc' 
  | 'created-asc' 
  | 'comments-desc' 
  | 'comments-asc'
  | 'state-priority';

/**
 * PR 표시 도메인 서비스
 */
export class PRDisplayService {
  /**
   * PR 상태별 설정
   */
  private static readonly STATE_CONFIG: Record<string, PRStateConfig> = {
    open: {
      variant: 'github-open',
      label: 'Open',
      priority: 1,
      iconEmoji: '🟢'
    },
    merged: {
      variant: 'github-merged',
      label: 'Merged',
      priority: 2,
      iconEmoji: '🟣'
    },
    closed: {
      variant: 'github-closed',
      label: 'Closed',
      priority: 3,
      iconEmoji: '🔴'
    },
  };

  /**
   * PR 상태 표시 정보 반환
   */
  static getStateDisplayInfo(state: string): PRStateConfig {
    return this.STATE_CONFIG[state] || this.STATE_CONFIG.closed;
  }

  /**
   * 생성 날짜 포맷팅
   */
  static formatCreatedDate(dateString: string, locale: string = 'ko-KR'): string {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * 업데이트 날짜 포맷팅
   */
  static formatUpdatedDate(dateString: string, locale: string = 'ko-KR'): string {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * 상대적 시간 표시
   */
  static getRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: '년', seconds: 31536000 },
      { label: '개월', seconds: 2592000 },
      { label: '일', seconds: 86400 },
      { label: '시간', seconds: 3600 },
      { label: '분', seconds: 60 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count}${interval.label} 전`;
      }
    }

    return '방금 전';
  }

  /**
   * 코멘트 수 요약
   */
  static getCommentsSummary(commentCount: number): string {
    if (commentCount === 0) return '코멘트 없음';
    if (commentCount === 1) return '1개 코멘트';
    if (commentCount < 10) return `${commentCount}개 코멘트`;
    if (commentCount < 50) return `${commentCount}개 코멘트 (활발)`;
    return `${commentCount}개 코멘트 (매우 활발)`;
  }

  /**
   * PR 긴급도 계산
   */
  static calculateUrgencyLevel(pr: PullRequest): 'high' | 'medium' | 'low' {
    const daysSinceUpdate = this.getDaysSinceUpdate(pr.updatedAt);
    const commentCount = pr.commentCount || 0;

    // 긴급도 계산 로직
    if (pr.state === 'open') {
      if (daysSinceUpdate <= 1 && commentCount >= 10) return 'high';
      if (daysSinceUpdate <= 3 && commentCount >= 5) return 'high';
      if (daysSinceUpdate <= 7) return 'medium';
    }

    if (pr.state === 'merged' && daysSinceUpdate <= 1) return 'medium';

    return 'low';
  }

  /**
   * 업데이트 이후 경과 일수 계산
   */
  private static getDaysSinceUpdate(updatedAt: string): number {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * PR 표시 메타데이터 생성
   */
  static createDisplayMetadata(pr: PullRequest): PRDisplayMetadata {
    return {
      formattedDate: this.formatCreatedDate(pr.createdAt),
      relativeTime: this.getRelativeTime(pr.updatedAt),
      stateConfig: this.getStateDisplayInfo(pr.state),
      commentsSummary: this.getCommentsSummary(pr.commentCount || 0),
      urgencyLevel: this.calculateUrgencyLevel(pr)
    };
  }

  /**
   * PR 목록 정렬
   */
  static sortPRs(prs: PullRequest[], sortBy: PRSortOption): PullRequest[] {
    const sorted = [...prs];

    switch (sortBy) {
      case 'updated-desc':
        return sorted.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      
      case 'updated-asc':
        return sorted.sort((a, b) => 
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      
      case 'created-desc':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      
      case 'created-asc':
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      
      case 'comments-desc':
        return sorted.sort((a, b) => 
          (b.commentCount || 0) - (a.commentCount || 0)
        );
      
      case 'comments-asc':
        return sorted.sort((a, b) => 
          (a.commentCount || 0) - (b.commentCount || 0)
        );
      
      case 'state-priority':
        return sorted.sort((a, b) => {
          const priorityA = this.getStateDisplayInfo(a.state).priority;
          const priorityB = this.getStateDisplayInfo(b.state).priority;
          return priorityA - priorityB;
        });
      
      default:
        return sorted;
    }
  }

  /**
   * PR 상태별 그룹핑
   */
  static groupPRsByState(prs: PullRequest[]): Record<string, PullRequest[]> {
    return prs.reduce((groups, pr) => {
      const state = pr.state;
      if (!groups[state]) {
        groups[state] = [];
      }
      groups[state].push(pr);
      return groups;
    }, {} as Record<string, PullRequest[]>);
  }

  /**
   * PR 필터링 (상태, 작성자, 키워드)
   */
  static filterPRs(
    prs: PullRequest[],
    filters: {
      states?: string[];
      author?: string;
      keyword?: string;
      minComments?: number;
    }
  ): PullRequest[] {
    return prs.filter(pr => {
      // 상태 필터
      if (filters.states && filters.states.length > 0) {
        if (!filters.states.includes(pr.state)) return false;
      }

      // 작성자 필터
      if (filters.author) {
        if (pr.author.login !== filters.author) return false;
      }

      // 키워드 필터
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const titleMatch = pr.title.toLowerCase().includes(keyword);
        const bodyMatch = false; // PullRequest 타입에 body 없음
        if (!titleMatch && !bodyMatch) return false;
      }

      // 최소 코멘트 수 필터
      if (filters.minComments !== undefined) {
        if ((pr.commentCount || 0) < filters.minComments) return false;
      }

      return true;
    });
  }

  /**
   * PR 표시용 CSS 클래스 생성
   */
  static generateCardClasses(
    selected: boolean,
    disabled: boolean,
    urgencyLevel: 'high' | 'medium' | 'low',
    hasOnSelect: boolean
  ): string {
    const classes = ['transition-all', 'duration-200'];

    if (!disabled && hasOnSelect) {
      classes.push('cursor-pointer', 'hover:shadow-card-hover', 'hover:-translate-y-0.5');
    }

    if (selected) {
      classes.push('ring-2', 'ring-primary-500', 'bg-primary-50');
    }

    if (disabled) {
      classes.push('opacity-50', 'cursor-not-allowed');
    }

    // 긴급도별 스타일
    switch (urgencyLevel) {
      case 'high':
        classes.push('border-l-4', 'border-red-500');
        break;
      case 'medium':
        classes.push('border-l-4', 'border-yellow-500');
        break;
      default:
        // low priority는 기본 스타일
        break;
    }

    return classes.join(' ');
  }

  /**
   * PR 통계 계산
   */
  static calculatePRStats(prs: PullRequest[]) {
    const total = prs.length;
    const stateCount = prs.reduce((acc, pr) => {
      acc[pr.state] = (acc[pr.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalComments = prs.reduce((sum, pr) => sum + (pr.commentCount || 0), 0);
    const avgComments = total > 0 ? Math.round((totalComments / total) * 10) / 10 : 0;

    const urgencyDistribution = prs.reduce((acc, pr) => {
      const urgency = this.calculateUrgencyLevel(pr);
      acc[urgency] = (acc[urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      stateCount,
      totalComments,
      avgComments,
      urgencyDistribution
    };
  }

  /**
   * 사용 가능한 정렬 옵션 반환
   */
  static getSortOptions(): Array<{value: PRSortOption; label: string}> {
    return [
      { value: 'updated-desc', label: '최근 업데이트순' },
      { value: 'updated-asc', label: '오래된 업데이트순' },
      { value: 'created-desc', label: '최근 생성순' },
      { value: 'created-asc', label: '오래된 생성순' },
      { value: 'comments-desc', label: '코멘트 많은순' },
      { value: 'comments-asc', label: '코멘트 적은순' },
      { value: 'state-priority', label: '상태별 우선순위' }
    ];
  }
}