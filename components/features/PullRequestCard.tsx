import { PullRequest } from '@/types/github';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface PullRequestCardProps {
  pullRequest: PullRequest;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
  disabled?: boolean;
}

const stateColors = {
  open: 'bg-github-open text-white',
  merged: 'bg-github-merged text-white',
  closed: 'bg-github-closed text-white',
};

const stateIcons = {
  open: '🔄',
  merged: '✅',
  closed: '❌',
};

export function PullRequestCard({ 
  pullRequest, 
  onSelect, 
  selected = false,
  disabled = false
}: PullRequestCardProps) {
  const createdAt = new Date(pullRequest.createdAt).toLocaleDateString('ko-KR');
  
  const handleClick = () => {
    if (disabled) return;
    onSelect?.(!selected);
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200',
        !disabled && onSelect && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5',
        selected && 'ring-2 ring-primary-500 bg-primary-50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {onSelect && (
            <input
              type="checkbox"
              checked={selected}
              onChange={handleClick}
              disabled={disabled}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          )}

          <div className="flex-1 min-w-0">
            {/* PR 제목 */}
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
              {pullRequest.title}
            </h3>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-body2 text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <img
                  src={pullRequest.author.avatarUrl}
                  alt={pullRequest.author.login}
                  className="w-4 h-4 rounded-full"
                />
                <span>{pullRequest.author.login}</span>
              </div>
              
              <span>📅 {createdAt}</span>
              
              {pullRequest.commentCount > 0 && (
                <span>💬 {pullRequest.commentCount}</span>
              )}
            </div>

            {/* 상태 뱃지 */}
            <div className="flex items-center gap-2">
              <span 
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-caption font-medium',
                  stateColors[pullRequest.state]
                )}
              >
                {stateIcons[pullRequest.state]} 
                {pullRequest.state === 'open' ? 'Open' : 
                 pullRequest.state === 'merged' ? 'Merged' : 'Closed'}
              </span>
              
              <span className="text-caption text-gray-500">
                #{pullRequest.number}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}