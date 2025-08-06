import { useQuery } from '@tanstack/react-query';
import { Repository, PullRequest } from '@/types/github';

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
    queryFn: async (): Promise<{ repositories: Repository[]; total?: number }> => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        sort,
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/github/repositories?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch repositories');
      }

      return response.json();
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
    queryFn: async (): Promise<{ pulls: PullRequest[]; total: number }> => {
      const params = new URLSearchParams({
        owner,
        repo,
        state,
        page: page.toString(),
        per_page: perPage.toString(),
        sort,
      });

      const response = await fetch(`/api/github/pulls?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch pull requests');
      }

      return response.json();
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
    queryFn: async (): Promise<{ repositories: Repository[]; total?: number }> => {
      if (!searchTerm.trim()) {
        return { repositories: [] };
      }

      const params = new URLSearchParams({
        search: searchTerm,
        per_page: '50',
      });

      const response = await fetch(`/api/github/repositories?${params}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search repositories');
      }

      return response.json();
    },
    enabled: enabled && searchTerm.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2분
  });
}