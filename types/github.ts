// GitHub API 관련 타입 정의

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  default_branch: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  merged_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  html_url: string;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
}

export interface GitHubIssueComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}

export interface GitHubReviewComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
  body: string;
  path: string;
  line: number | null;
  diff_hunk: string;
  html_url: string;
}

// 화면에서 사용할 정제된 타입들
export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  prCount?: number; // 나중에 추가로 조회
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
  updatedAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  commentCount: number; // comments + review_comments
  repository: {
    owner: string;
    name: string;
  };
}

export interface PRComment {
  id: number;
  author: {
    login: string;
    avatarUrl: string;
    isBot: boolean;
  };
  createdAt: string;
  body: string;
  type: 'issue_comment' | 'review_comment';
  path?: string; // review_comment일 경우
  line?: number; // review_comment일 경우
}