import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { githubService, type RepositoryResponse } from '@/lib/api/githubService';

// 레포지토리 목록 조회
export function useRepositories(options?: {
  search?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  enabled?: boolean;
}) {
  const { search, page = 1, perPage = 30, sort = 'updated', enabled = true } = options || {};

  return useQuery({
    queryKey: ['repositories', { search, page, perPage, sort }],
    queryFn: (): Promise<RepositoryResponse> => {
      return githubService.getRepositories({
        search,
        page,
        per_page: perPage,
        sort,
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

// 특정 레포지토리의 PR 목록 조회
export function usePullRequests(
  owner: string,
  repo: string,
  options?: {
    state?: string;
    page?: number;
    perPage?: number;
    sort?: string;
    enabled?: boolean;
  }
) {
  const { state = 'all', page = 1, perPage = 30, sort = 'updated', enabled = true } = options || {};

  return useQuery({
    queryKey: ['pulls', owner, repo, { state, page, perPage, sort }],
    queryFn: () => {
      return githubService.getPullRequests({
        owner,
        repo,
        state,
        page,
        per_page: perPage,
        sort,
      });
    },
    enabled: enabled && !!owner && !!repo,
    staleTime: 3 * 60 * 1000, // 3분
  });
}

// 레포지토리 검색
export function useRepositorySearch(searchTerm: string, options?: { enabled?: boolean }) {
  const { enabled = true } = options || {};

  return useQuery({
    queryKey: ['repository-search', searchTerm],
    queryFn: (): Promise<RepositoryResponse> => {
      return githubService.searchRepositories(searchTerm, 50);
    },
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2분
  });
}

// 무한 스크롤용 레포지토리 목록 조회
export function useInfiniteRepositories(options?: {
  search?: string;
  perPage?: number;
  sort?: string;
  enabled?: boolean;
}) {
  const { search, perPage = 30, sort = 'updated', enabled = true } = options || {};

  return useInfiniteQuery({
    queryKey: ['repositories-infinite', { search, perPage, sort }],
    queryFn: async ({ pageParam = 1 }): Promise<RepositoryResponse> => {
      return githubService.getRepositories({
        search,
        page: pageParam,
        per_page: perPage,
        sort,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // 더 이상 가져올 데이터가 없으면 undefined 반환
      if (lastPage.repositories.length < perPage) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5분
    initialPageParam: 1,
  });
}

// 무한 스크롤용 PR 목록 조회
export function useInfinitePullRequests(
  owner: string,
  repo: string,
  options?: {
    state?: string;
    perPage?: number;
    sort?: string;
    enabled?: boolean;
  }
) {
  const { state = 'all', perPage = 30, sort = 'updated', enabled = true } = options || {};

  return useInfiniteQuery({
    queryKey: ['pulls-infinite', owner, repo, { state, perPage, sort }],
    queryFn: async ({ pageParam = 1 }) => {
      return githubService.getPullRequests({
        owner,
        repo,
        state,
        page: pageParam,
        per_page: perPage,
        sort,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // 더 이상 가져올 데이터가 없으면 undefined 반환
      if (lastPage.pulls.length < perPage) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: enabled && !!owner && !!repo,
    staleTime: 3 * 60 * 1000, // 3분
    initialPageParam: 1,
  });
}