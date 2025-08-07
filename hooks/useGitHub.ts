import { useQuery } from '@tanstack/react-query';
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