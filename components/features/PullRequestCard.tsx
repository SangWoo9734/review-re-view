import { Card, CardContent } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { PRDisplayService } from "@/lib/services/prDisplayService";
import { cn } from "@/lib/utils";
import { PullRequest } from "@/types/github";
import Image from "next/image";

interface PullRequestCardProps {
  pullRequest: PullRequest;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
  disabled?: boolean;
}

export function PullRequestCard({
  pullRequest,
  onSelect,
  selected = false,
  disabled = false,
}: PullRequestCardProps) {
  const displayMetadata = PRDisplayService.createDisplayMetadata(pullRequest);
  const cardClasses = PRDisplayService.generateCardClasses(
    selected,
    disabled,
    displayMetadata.urgencyLevel,
    !!onSelect
  );

  const handleClick = () => {
    if (disabled) return;
    onSelect?.(!selected);
  };

  return (
    <Card className={cn(cardClasses)} onClick={handleClick}>
      <CardContent>
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
            <span className="text-caption text-gray-500">
              - #{pullRequest.number}
            </span>

            {/* 메타 정보 */}
            <div className="flex justify-between items-center gap-4 text-body2 text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Image
                  width={16}
                  height={16}
                  src={pullRequest.author.avatarUrl}
                  alt={pullRequest.author.login}
                  className="rounded-full"
                />
                <span>{pullRequest.author.login}</span>
              </div>
              <div className="flex items-center gap-2">
                <p>📅 {displayMetadata.formattedDate}</p>
                <p>⏰ {displayMetadata.relativeTime}</p>
              </div>
            </div>

            {/* 상태 뱃지 및 코멘트 정보 */}
            <div className="flex items-center gap-2">
              <Chip variant={displayMetadata.stateConfig.variant} size="sm">
                {displayMetadata.stateConfig.iconEmoji}{" "}
                {displayMetadata.stateConfig.label}
              </Chip>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
