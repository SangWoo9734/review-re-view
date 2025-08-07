// 🌐 API 레이어 - GitHub API 서비스
// 관심사: GitHub API 통신, 데이터 변환, 에러 처리

import { internalApiClient } from './apiClient';
import type { Repository, PullRequest } from '@/types/github';

/**
 * GitHub 레포지토리 조회 파라미터
 */
export interface RepositoryParams {
  search?: string;
  page?: number;
  per_page?: number;
  sort?: string;
}

/**
 * GitHub Pull Request 조회 파라미터  
 */
export interface PullRequestParams {
  owner: string;
  repo: string;
  state?: string;
  page?: number;
  per_page?: number;
  sort?: string;
}

/**
 * 레포지토리 목록 응답
 */
export interface RepositoryResponse {
  repositories: Repository[];
  total?: number;
}

/**
 * Pull Request 목록 응답
 */
export interface PullRequestResponse {
  pulls: PullRequest[];
  total: number;
}

/**
 * GitHub API 서비스 클래스
 */
export class GitHubService {
  /**
   * 레포지토리 목록 조회
   */
  async getRepositories(params: RepositoryParams = {}): Promise<RepositoryResponse> {
    const { search, page = 1, per_page = 30, sort = 'updated' } = params;
    
    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      sort,
    });

    if (search) {
      searchParams.append('search', search);
    }

    const response = await internalApiClient.get<RepositoryResponse>(
      `github/repositories?${searchParams}`
    );
    
    return response.data;
  }

  /**
   * Pull Request 목록 조회
   */
  async getPullRequests(params: PullRequestParams): Promise<PullRequestResponse> {
    const { 
      owner, 
      repo, 
      state = 'all', 
      page = 1, 
      per_page = 30, 
      sort = 'updated' 
    } = params;
    
    const searchParams = new URLSearchParams({
      owner,
      repo,
      state,
      page: page.toString(),
      per_page: per_page.toString(),
      sort,
    });

    const response = await internalApiClient.get<PullRequestResponse>(
      `github/pulls?${searchParams}`
    );
    
    return response.data;
  }

  /**
   * 레포지토리 검색
   */
  async searchRepositories(searchTerm: string, perPage = 50): Promise<RepositoryResponse> {
    if (!searchTerm.trim()) {
      return { repositories: [] };
    }

    const searchParams = new URLSearchParams({
      search: searchTerm,
      per_page: perPage.toString(),
    });

    const response = await internalApiClient.get<RepositoryResponse>(
      `github/repositories?${searchParams}`
    );
    
    return response.data;
  }
}

/**
 * GitHub 서비스 싱글톤 인스턴스
 */
export const githubService = new GitHubService();