import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('github_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 });
  }

  try {
    // GitHub API로 토큰 유효성 검증
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userData = await response.json();
    return NextResponse.json({
      valid: true,
      user: {
        id: userData.id,
        login: userData.login,
        avatar_url: userData.avatar_url,
        name: userData.name,
      },
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}