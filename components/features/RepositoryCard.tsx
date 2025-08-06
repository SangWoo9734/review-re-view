import { Repository } from '@/types/github';
import { Card, CardContent } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/utils';

interface RepositoryCardProps {
  repository: Repository;
  onClick?: () => void;
  selected?: boolean;
  showPRCount?: boolean;
}

export function RepositoryCard({ 
  repository, 
  onClick, 
  selected = false,
  showPRCount = false 
}: RepositoryCardProps) {
  const updatedAt = new Date(repository.updatedAt).toLocaleDateString('ko-KR');

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200',
        selected && 'ring-2 ring-primary-500 bg-primary-50',
        onClick && 'hover:shadow-card-hover hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {repository.name}
            </h3>
            <p className="text-caption text-gray-500">
              {repository.owner.login}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            {repository.isPrivate && (
              <Chip variant="default" size="sm">
                🔒 Private
              </Chip>
            )}
            {showPRCount && repository.prCount !== undefined && (
              <Chip variant="info" size="sm">
                📝 {repository.prCount}
              </Chip>
            )}
          </div>
        </div>

        {repository.description && (
          <p className="text-body2 text-gray-600 mb-3 line-clamp-2">
            {repository.description}
          </p>
        )}

        <div className="flex items-center justify-between text-caption text-gray-500">
          <div className="flex items-center gap-4">
            {repository.language && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                {repository.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              ⭐ {repository.stars}
            </span>
            <span className="flex items-center gap-1">
              🍴 {repository.forks}
            </span>
          </div>
          
          <span>업데이트: {updatedAt}</span>
        </div>
      </CardContent>
    </Card>
  );
}