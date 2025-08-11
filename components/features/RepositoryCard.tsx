import { Card, CardContent } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { Repository } from "@/types/github";
import { TechStackColorService } from "@/lib/utils/techStackColors";

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
  showPRCount = false,
}: RepositoryCardProps) {
  const updatedAt = new Date(repository.updatedAt).toLocaleDateString("ko-KR");
  
  // 기술 스택 색상 정보 가져오기
  const techInfo = repository.language 
    ? TechStackColorService.getTechInfo(repository.language)
    : null;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 w-full py-5",
        selected && "ring-2 ring-primary-500 bg-primary-50",
        onClick && "hover:shadow-card-hover hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <CardContent>
        {/* Header: 레포명과 태그들 */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
              {repository.name}
            </h3>
            <p className="text-xs text-gray-500">{repository.owner.login}</p>
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

        {/* Footer: 메타 정보들 */}
        <div className="space-y-2">
          {/* 언어와 통계 */}
          <div className="flex justify-between items-center gap-4 text-sm text-gray-500">
            {repository.language && techInfo ? (
              <span className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: techInfo.color }}
                  title={`${techInfo.name} - ${techInfo.color}`}
                />
                <span className="text-xs font-medium text-gray-700 truncate">
                  {techInfo.icon} {repository.language}
                </span>
              </span>
            ) : repository.language ? (
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 truncate">
                  💻 {repository.language}
                </span>
              </span>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                ⭐ {repository.stars}
              </span>
              <span className="flex items-center gap-1">
                🍴 {repository.forks}
              </span>
            </div>
          </div>

          {/* 업데이트 날짜 */}
          <div className="text-xs text-gray-400">업데이트: {updatedAt}</div>
        </div>
      </CardContent>
    </Card>
  );
}
