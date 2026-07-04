import { cn } from '@/shared/lib/utils';

import type { UseMatchFunnelReturn } from '../hooks';

interface MatchTypeToggleProps {
  funnel: UseMatchFunnelReturn;
  className?: string;
}

export default function MatchTypeToggle({ funnel, className }: MatchTypeToggleProps) {
  const handleTypeChange = (newType: 'BASIC' | 'PRECISE') => {
    funnel.toStep('profile', {
      type: newType,
    });
  };
  return (
    <div className={cn('flex w-fit rounded-full bg-gray-800 p-1', className)}>
      <button
        type="button"
        onClick={() => handleTypeChange('BASIC')}
        className={cn(
          'rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200',
          funnel.type === 'BASIC' ? 'bg-white text-gray-800' : 'text-gray-400 hover:text-gray-300'
        )}
      >
        빠른 매칭
      </button>
      <button
        type="button"
        onClick={() => handleTypeChange('PRECISE')}
        className={cn(
          'rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200',
          funnel.type === 'PRECISE' ? 'bg-white text-gray-800' : 'text-gray-400 hover:text-gray-300'
        )}
      >
        맞춤 매칭
      </button>
    </div>
  );
}
