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
        'cursor-pointer transition-all duration-200 w-full',
        selected && 'ring-2 ring-primary-500 bg-primary-50',
        onClick && 'hover:shadow-card-hover hover:-translate-y-0.5'
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header: 레포명과 태그들 */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
              {repository.name}
            </h3>
            <p className="text-sm text-gray-500">
              {repository.owner.login}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 flex-shrink-0">
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

        {/* Description */}
        {repository.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {repository.description}
          </p>
        )}

        {/* Footer: 메타 정보들 */}
        <div className="space-y-2">
          {/* 언어와 통계 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {repository.language && (
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="truncate">{repository.language}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              ⭐ {repository.stars}
            </span>
            <span className="flex items-center gap-1">
              🍴 {repository.forks}
            </span>
          </div>
          
          {/* 업데이트 날짜 */}
          <div className="text-sm text-gray-400">
            업데이트: {updatedAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}