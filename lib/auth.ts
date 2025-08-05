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
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }

  try {
    const userInfo = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='))
      ?.split('=')[1];

    if (!userInfo) {
      return { isAuthenticated: false, user: null };
    }

    const user = JSON.parse(decodeURIComponent(userInfo));
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

// 로그아웃 함수
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      // 페이지 새로고침으로 상태 초기화
      window.location.href = '/';
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}