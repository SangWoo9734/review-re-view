// 🌐 API 레이어 - 인증 API 서비스
// 관심사: 인증 API 통신, OAuth 로직, 세션 관리

import { internalApiClient } from './apiClient';
import type { User } from '@/lib/auth';

/**
 * GitHub OAuth 파라미터
 */
export interface GitHubOAuthParams {
  clientId: string;
  redirectUri: string;
  scope?: string;
  state?: string;
}

/**
 * 인증 상태
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

/**
 * 인증 API 서비스 클래스
 */
export class AuthService {
  /**
   * GitHub OAuth 인증 URL 생성
   */
  generateGitHubAuthUrl(params: GitHubOAuthParams): string {
    const { 
      clientId, 
      redirectUri, 
      scope = 'repo user:email', 
      state = Math.random().toString(36).substring(2, 15) 
    } = params;

    const urlParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      state,
    });

    return `https://github.com/login/oauth/authorize?${urlParams.toString()}`;
  }

  /**
   * GitHub OAuth 로그인 리다이렉트 실행
   */
  redirectToGitHubAuth(): void {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      throw new Error('GitHub Client ID가 설정되지 않았습니다.');
    }

    const redirectUri = `${window.location.origin}/api/auth/github`;
    const authUrl = this.generateGitHubAuthUrl({
      clientId,
      redirectUri,
    });

    window.location.href = authUrl;
  }

  /**
   * 로그아웃 API 호출
   */
  async logout(): Promise<boolean> {
    try {
      const response = await internalApiClient.post('auth/logout');
      return response.status === 200;
    } catch (error) {
      console.error('Logout API error:', error);
      return false;
    }
  }

  /**
   * 클라이언트 사이드에서 쿠키로부터 인증 상태 확인
   */
  getClientAuthState(): AuthState {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, user: null };
    }

    try {
      const userInfo = this.getCookieValue('user_info');
      
      if (!userInfo) {
        return { isAuthenticated: false, user: null };
      }

      const user = JSON.parse(decodeURIComponent(userInfo)) as User;
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Failed to parse auth state from cookies:', error);
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * 쿠키에서 특정 값 추출
   */
  private getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') {
      return null;
    }

    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1];

    return value || null;
  }

  /**
   * 인증 상태 새로고침 후 페이지 리다이렉트
   */
  refreshAuthAndRedirect(redirectPath: string = '/'): void {
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
  }

  /**
   * 인증된 사용자 정보 검증 API 호출 (서버사이드)
   */
  async verifyToken(): Promise<User | null> {
    try {
      const response = await internalApiClient.get<{ user: User }>('auth/verify');
      return response.data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
}

/**
 * 인증 서비스 싱글톤 인스턴스
 */
export const authService = new AuthService();