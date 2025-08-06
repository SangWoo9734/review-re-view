import { Octokit } from '@octokit/rest';
import { 
  GitHubRepository, 
  GitHubPullRequest, 
  GitHubIssueComment, 
  GitHubReviewComment,
  Repository,
  PullRequest,
  PRComment
} from '@/types/github';

// GitHub API 클라이언트 생성
export function createGitHubClient(token: string) {
  return new Octokit({
    auth: token,
  });
}

// 서버 사이드에서 토큰으로 클라이언트 생성
export async function getServerGitHubClient(request: Request): Promise<Octokit | null> {
  try {
    const cookies = request.headers.get('cookie');
    if (!cookies) return null;

    const tokenCookie = cookies
      .split('; ')
      .find(cookie => cookie.startsWith('github_token='));
    
    if (!tokenCookie) return null;

    const token = tokenCookie.split('=')[1];
    return createGitHubClient(token);
  } catch (error) {
    console.error('Failed to create GitHub client:', error);
    return null;
  }
}

// GitHub 데이터를 앱 형식으로 변환하는 유틸리티 함수들
export function transformRepository(repo: GitHubRepository): Repository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    isPrivate: repo.private,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
    },
  };
}

export function transformPullRequest(pr: GitHubPullRequest, owner: string, repo: string): PullRequest {
  // merged_at이 있으면 merged, 없고 state가 closed면 closed, 그 외엔 open
  const state = pr.merged_at ? 'merged' : pr.state as 'open' | 'closed';
  
  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    state,
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    author: {
      login: pr.user.login,
      avatarUrl: pr.user.avatar_url,
    },
    commentCount: pr.comments + pr.review_comments,
    repository: {
      owner,
      name: repo,
    },
  };
}

export function transformComment(
  comment: GitHubIssueComment | GitHubReviewComment,
  type: 'issue_comment' | 'review_comment'
): PRComment {
  const baseComment = {
    id: comment.id,
    author: {
      login: comment.user.login,
      avatarUrl: comment.user.avatar_url,
      isBot: comment.user.type === 'Bot',
    },
    createdAt: comment.created_at,
    body: comment.body,
    type,
  };

  if (type === 'review_comment') {
    const reviewComment = comment as GitHubReviewComment;
    return {
      ...baseComment,
      path: reviewComment.path,
      line: reviewComment.line,
    };
  }

  return baseComment;
}

// API 호출 헬퍼 함수들
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export function handleGitHubAPIError(error: any): never {
  if (error.status) {
    throw new GitHubAPIError(
      error.message || 'GitHub API Error',
      error.status,
      error.response
    );
  }
  throw error;
}