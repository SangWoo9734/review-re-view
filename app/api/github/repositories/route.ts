import { NextRequest, NextResponse } from 'next/server';
import { getServerGitHubClient, transformRepository } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const client = await getServerGitHubClient(request);
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '30');
    const sort = searchParams.get('sort') || 'updated';
    const type = searchParams.get('type') || 'all'; // all, owner, member
    const search = searchParams.get('search');

    let repositories;

    if (search) {
      // 검색어가 있으면 search API 사용
      const response = await client.search.repos({
        q: `user:@me ${search}`,
        sort: sort as 'updated' | 'stars' | 'forks',
        order: 'desc',
        page,
        per_page: perPage,
      });
      repositories = response.data.items;
    } else {
      // 일반 레포지토리 목록 조회
      const response = await client.repos.listForAuthenticatedUser({
        type: type as 'all' | 'owner' | 'member',
        sort: sort as 'created' | 'updated' | 'pushed' | 'full_name',
        direction: 'desc',
        page,
        per_page: perPage,
      });
      repositories = response.data;
    }

    // 변환하여 반환
    const transformedRepos = repositories.map(transformRepository);

    return NextResponse.json({
      repositories: transformedRepos,
      total: search ? undefined : transformedRepos.length, // search API는 total_count 제공하지만 일반 API는 안함
    });

  } catch (error: unknown) {
    console.error('GitHub repositories API error:', error);
    
    if (error && typeof error === 'object' && 'status' in error) {
      const apiError = error as { status: number; message?: string };
      
      if (apiError.status === 401) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      if (apiError.status === 403) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded',
          message: 'GitHub API rate limit exceeded. Please try again later.'
        }, { status: 403 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}