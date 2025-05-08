
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  prefix?: string;
  suffix?: string;
}

const MetricsCard = ({
  title,
  value,
  icon,
  change,
  className,
  prefix = '',
  suffix = '',
}: MetricsCardProps) => {
  return (
    <div className={cn('metrics-card', className)} tabIndex={0}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500" id={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}>
          {title}
        </h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <p 
          className="text-2xl font-semibold text-gray-900"
          aria-labelledby={`${title.replace(/\s+/g, '-').toLowerCase()}-heading`}
        >
          {prefix}{value.toLocaleString()}{suffix}
        </p>
        {change && (
          <span
            className={cn(
              'ml-2 text-sm font-medium',
              change.isPositive ? 'text-success' : 'text-danger'
            )}
          >
            {change.isPositive ? '+' : '-'}
            {Math.abs(change.value).toLocaleString()}%
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
