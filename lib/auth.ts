import { authService } from '@/lib/api/authService';

export interface User {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// 클라이언트 사이드에서 인증 상태 확인
export function getClientAuthState(): AuthState {
  return authService.getClientAuthState();
}

// 로그아웃 함수
export async function logout(): Promise<boolean> {
  try {
    const success = await authService.logout();
    if (success) {
      // 페이지 새로고침으로 상태 초기화
      authService.refreshAuthAndRedirect('/');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}