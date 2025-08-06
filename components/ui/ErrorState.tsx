import { Button } from './Button';
import { Card, CardContent } from './Card';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = '오류가 발생했습니다',
  message = '데이터를 불러오는 중 문제가 발생했습니다.',
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <div className={className}>
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-h3 text-gray-900 mb-2">{title}</h3>
            <p className="text-body2 text-gray-600 mb-6">{message}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="primary">
                다시 시도
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title = '데이터가 없습니다',
  message,
  icon = '📭',
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={className}>
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-h3 text-gray-900 mb-2">{title}</h3>
            {message && (
              <p className="text-body2 text-gray-600 mb-6">{message}</p>
            )}
            {action && (
              <Button onClick={action.onClick} variant="primary">
                {action.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}