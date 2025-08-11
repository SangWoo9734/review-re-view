import { NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const _state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(`${NEXTAUTH_URL}/?error=missing_code`);
  }

  try {
    // GitHub OAuth 토큰 교환
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      return NextResponse.redirect(`${NEXTAUTH_URL}/?error=oauth_error`);
    }

    // 사용자 정보 가져오기
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/json',
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('GitHub API error:', userData);
      return NextResponse.redirect(`${NEXTAUTH_URL}/?error=user_fetch_error`);
    }

    // 쿠키에 토큰 저장
    const response = NextResponse.redirect(`${NEXTAUTH_URL}/dashboard`);
    
    // HttpOnly 쿠키로 보안 강화
    response.cookies.set('github_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    // 사용자 정보도 별도 쿠키에 저장 (클라이언트에서 접근 가능)
    response.cookies.set('user_info', JSON.stringify({
      id: userData.id,
      login: userData.login,
      avatar_url: userData.avatar_url,
      name: userData.name,
    }), {
      httpOnly: false, // 클라이언트에서 접근 가능
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${NEXTAUTH_URL}/?error=server_error`);
  }
}