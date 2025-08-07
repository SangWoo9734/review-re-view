import { ActionItem } from '@/lib/actionItems';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';

interface ActionItemCardProps {
  actionItem: ActionItem;
  onExpand?: (id: string) => void;
  expanded?: boolean;
}

// 우선순위별 아이콘 및 색상
const PRIORITY_CONFIG = {
  P1: {
    icon: '🚨',
    variant: 'error' as const,
    label: '긴급',
    description: '즉시 처리 필요'
  },
  P2: {
    icon: '⚠️',
    variant: 'warning' as const,
    label: '중요',
    description: '가능한 빨리 처리'
  },
  P3: {
    icon: '💡',
    variant: 'info' as const,
    label: '제안',
    description: '시간이 될 때 검토'
  }
};

// 카테고리별 아이콘
const CATEGORY_CONFIG = {
  immediate: { icon: '⚡', label: '즉시 처리' },
  improvement: { icon: '📈', label: '개선 사항' },
  consideration: { icon: '🤔', label: '검토 사항' }
};

// 임팩트/노력도 표시
const IMPACT_CONFIG = {
  high: { color: '#ef4444', label: '높음' },
  medium: { color: '#f59e0b', label: '중간' },
  low: { color: '#10b981', label: '낮음' }
};

export function ActionItemCard({ actionItem, onExpand, expanded = false }: ActionItemCardProps) {
  const priorityConfig = PRIORITY_CONFIG[actionItem.priority];
  const categoryConfig = CATEGORY_CONFIG[actionItem.category];

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-card-hover ${
        actionItem.priority === 'P1' ? 'border-red-200' : 
        actionItem.priority === 'P2' ? 'border-yellow-200' : 
        'border-blue-200'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Chip variant={priorityConfig.variant} size="sm">
                {priorityConfig.icon} {priorityConfig.label}
              </Chip>
              <Chip variant="default" size="sm">
                {categoryConfig.icon} {categoryConfig.label}
              </Chip>
            </div>
            <CardTitle className="text-lg leading-tight">
              {actionItem.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 mb-4">
          {actionItem.description}
        </p>

        {/* 임팩트 & 노력도 */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">임팩트:</span>
            <span 
              className="font-medium"
              style={{ color: IMPACT_CONFIG[actionItem.impact].color }}
            >
              {IMPACT_CONFIG[actionItem.impact].label}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">노력도:</span>
            <span 
              className="font-medium"
              style={{ color: IMPACT_CONFIG[actionItem.effort].color }}
            >
              {IMPACT_CONFIG[actionItem.effort].label}
            </span>
          </div>
        </div>

        {/* 관련 키워드 */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">🔗 관련 키워드</div>
          <div className="flex flex-wrap gap-1">
            {actionItem.relatedKeywords.slice(0, 5).map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 예시 (확장 시 표시) */}
        {expanded && actionItem.examples && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">
              💡 구현 예시
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              {actionItem.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 더보기/접기 버튼 */}
        {actionItem.examples && onExpand && (
          <button
            onClick={() => onExpand(actionItem.id)}
            className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {expanded ? '접기 ▲' : '자세히 보기 ▼'}
          </button>
        )}
      </CardContent>
    </Card>
  );
}