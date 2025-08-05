import { cookies } from 'next/headers';
import { AuthState } from './auth';

// GitHub OAuth URL 생성 (서버 사이드)
export function getGitHubAuthUrl(): string {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/github`;
  const scope = 'repo user:email';
  const state = Math.random().toString(36).substring(2, 15);

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope,
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// 서버 사이드에서 인증 상태 확인
export async function getServerAuthState(): Promise<AuthState> {
  const cookieStore = await cookies();
  const userInfoCookie = cookieStore.get('user_info');
  const tokenCookie = cookieStore.get('github_token');

  if (!userInfoCookie || !tokenCookie) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = JSON.parse(userInfoCookie.value);
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}