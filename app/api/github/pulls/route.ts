import { NextRequest, NextResponse } from 'next/server';
import { getServerGitHubClient, transformPullRequest, handleGitHubAPIError } from '@/lib/github';

export async function GET(request: NextRequest) {
  try {
    const client = await getServerGitHubClient(request);
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const state = searchParams.get('state') || 'all'; // open, closed, all
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '30');
    const sort = searchParams.get('sort') || 'updated'; // created, updated, popularity

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo parameters are required' },
        { status: 400 }
      );
    }

    const response = await client.pulls.list({
      owner,
      repo,
      state: state as 'open' | 'closed' | 'all',
      sort: sort as 'created' | 'updated' | 'popularity',
      direction: 'desc',
      page,
      per_page: perPage,
    });

    // 변환하여 반환
    const transformedPRs = response.data.map(pr => 
      transformPullRequest(pr, owner, repo)
    );

    return NextResponse.json({
      pulls: transformedPRs,
      total: transformedPRs.length,
    });

  } catch (error: any) {
    console.error('GitHub pulls API error:', error);
    
    if (error.status === 401) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    if (error.status === 403) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded',
        message: 'GitHub API rate limit exceeded. Please try again later.'
      }, { status: 403 });
    }

    if (error.status === 404) {
      return NextResponse.json({ 
        error: 'Repository not found',
        message: 'Repository not found or you do not have access to it.'
      }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch pull requests' },
      { status: 500 }
    );
  }
}