// 🏢 비즈니스 로직 레이어 - PR 선택 도메인 서비스
// 관심사: PR 선택 규칙, 필터링 로직, 유효성 검증

import type { PullRequest } from '@/types/github';

/**
 * 선택 유효성 검사 결과
 */
export interface ValidationResult {
  valid: boolean;
  reason?: 'LIMIT_EXCEEDED' | 'ALREADY_SELECTED' | 'INVALID_PR';
  message?: string;
}

/**
 * PR 선택 통계
 */
export interface SelectionStats {
  totalSelected: number;
  maxAllowed: number;
  canSelectMore: boolean;
  remainingSlots: number;
}

/**
 * PR 선택 도메인 서비스
 */
export class PRSelectionService {
  /**
   * 최대 선택 가능한 PR 수
   */
  private static readonly MAX_SELECTION_LIMIT = 5;

  /**
   * 사용자 소유 PR만 필터링
   */
  static filterPRsByOwnership(
    prs: PullRequest[], 
    userLogin: string, 
    showOnlyUserPRs: boolean
  ): PullRequest[] {
    if (!showOnlyUserPRs) {
      return prs;
    }
    
    return prs.filter(pr => pr.author.login === userLogin);
  }

  /**
   * PR 선택 유효성 검증
   */
  static validateSelection(
    currentSelection: PullRequest[], 
    prToAdd: PullRequest
  ): ValidationResult {
    // 이미 선택된 PR 확인
    if (currentSelection.some(pr => pr.id === prToAdd.id)) {
      return {
        valid: false,
        reason: 'ALREADY_SELECTED',
        message: '이미 선택된 PR입니다.'
      };
    }

    // 선택 개수 제한 확인
    if (currentSelection.length >= this.MAX_SELECTION_LIMIT) {
      return {
        valid: false,
        reason: 'LIMIT_EXCEEDED',
        message: `최대 ${this.MAX_SELECTION_LIMIT}개까지만 선택할 수 있습니다.`
      };
    }

    return { valid: true };
  }

  /**
   * PR 선택 추가
   */
  static addPRToSelection(
    currentSelection: PullRequest[],
    prToAdd: PullRequest
  ): PullRequest[] | null {
    const validation = this.validateSelection(currentSelection, prToAdd);
    
    if (!validation.valid) {
      return null;
    }

    return [...currentSelection, prToAdd];
  }

  /**
   * PR 선택 제거
   */
  static removePRFromSelection(
    currentSelection: PullRequest[],
    prToRemove: PullRequest
  ): PullRequest[] {
    return currentSelection.filter(pr => pr.id !== prToRemove.id);
  }

  /**
   * 선택 가능 여부 확인
   */
  static canSelectMore(currentSelection: PullRequest[]): boolean {
    return currentSelection.length < this.MAX_SELECTION_LIMIT;
  }

  /**
   * 선택 통계 계산
   */
  static getSelectionStats(currentSelection: PullRequest[]): SelectionStats {
    const totalSelected = currentSelection.length;
    const maxAllowed = this.MAX_SELECTION_LIMIT;
    const canSelectMore = totalSelected < maxAllowed;
    const remainingSlots = maxAllowed - totalSelected;

    return {
      totalSelected,
      maxAllowed,
      canSelectMore,
      remainingSlots,
    };
  }

  /**
   * 선택된 PR들의 메타데이터 계산
   */
  static getSelectionMetadata(selectedPRs: PullRequest[]) {
    const totalComments = selectedPRs.reduce(
      (sum, pr) => sum + (pr.commentCount || 0), 
      0
    );

    const avgCommentsPerPR = selectedPRs.length > 0 
      ? Math.round((totalComments / selectedPRs.length) * 10) / 10
      : 0;

    const stateDistribution = selectedPRs.reduce((acc, pr) => {
      acc[pr.state] = (acc[pr.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPRs: selectedPRs.length,
      totalComments,
      avgCommentsPerPR,
      stateDistribution,
    };
  }

  /**
   * PR 선택 추천 (우선순위 기반)
   */
  static recommendPRs(
    allPRs: PullRequest[], 
    currentSelection: PullRequest[],
    maxRecommendations: number = 3
  ): PullRequest[] {
    // 이미 선택된 PR 제외
    const availablePRs = allPRs.filter(
      pr => !currentSelection.some(selected => selected.id === pr.id)
    );

    // 우선순위 계산 (코멘트 수, 상태 등 고려)
    const scoredPRs = availablePRs.map(pr => ({
      pr,
      score: this.calculatePRScore(pr)
    }));

    // 점수순 정렬 후 상위 항목 반환
    return scoredPRs
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations)
      .map(item => item.pr);
  }

  /**
   * PR 점수 계산 (추천용)
   */
  private static calculatePRScore(pr: PullRequest): number {
    let score = 0;

    // 코멘트 수 기반 점수 (많을수록 높은 점수)
    score += Math.min((pr.commentCount || 0) * 2, 20);

    // 상태 기반 점수
    const stateScores = { open: 10, merged: 8, closed: 5 };
    score += stateScores[pr.state] || 0;

    // 최신 업데이트 기반 점수
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(pr.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(10 - daysSinceUpdate, 0); // 최근일수록 높은 점수

    return score;
  }

  /**
   * 최대 선택 제한 반환
   */
  static getMaxSelectionLimit(): number {
    return this.MAX_SELECTION_LIMIT;
  }
}