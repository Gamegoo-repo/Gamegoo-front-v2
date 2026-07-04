import { LOL_BTI_AXIS_CONFIG, type LolBtiAxisKey } from '@/features/lol-bti/test/config';
import { cn } from '@/shared/lib/utils';
import { FlexBox } from '@/shared/ui/flexbox';

interface LolBtiAxisResultProps {
  axisKey: LolBtiAxisKey;
  percentage: number; // left 기준
}

export function LolBtiAxisResult({ axisKey, percentage }: LolBtiAxisResultProps) {
  const { left, right } = LOL_BTI_AXIS_CONFIG[axisKey];
  const rightPercentage = 100 - percentage;

  const leftActive = percentage >= rightPercentage;
  const leftColor = leftActive ? left.color : '#666';
  const rightColor = !leftActive ? right.color : '#666';

  return (
    <FlexBox direction="column" align="center" className="w-full gap-1.5">
      <span className="text-xl font-medium text-white [text-shadow:0_0_8px_rgba(255,255,255,0.30)]">
        {axisKey}
      </span>
      <div className="h-[14px] w-full overflow-hidden rounded-full bg-[#666]">
        <div
          style={{
            width: `${leftActive ? percentage : rightPercentage}%`,
            backgroundColor: left.color,
          }}
          className={cn('h-full', !leftActive && 'ml-auto')}
        />
      </div>
      <FlexBox justify="between" className="mt-2.5 w-full">
        <FlexBox direction="column" align="center">
          <span
            className="text-xl font-bold [text-shadow:0_0_8px_rgba(255,255,255,0.30)]"
            style={{ color: leftColor }}
          >
            {percentage}%
          </span>
          <span className="mb-3 text-[15px]" style={{ color: leftColor }}>
            {left.name}
          </span>
          <span
            className={cn(
              'text-center text-sm break-keep',
              leftActive ? 'text-[#ccc]' : 'text-[#666]'
            )}
          >
            {left.desc}
          </span>
        </FlexBox>

        <FlexBox direction="column" align="center">
          <span
            className="text-xl font-bold [text-shadow:0_0_8px_rgba(255,255,255,0.30)]"
            style={{ color: rightColor }}
          >
            {rightPercentage}%
          </span>
          <span className="mb-3 inline-block text-[15px]" style={{ color: rightColor }}>
            {right.name}
          </span>
          <span
            className={cn(
              'inline-block text-center text-sm break-keep',
              leftActive ? 'text-[#666]' : 'text-[#ccc]'
            )}
          >
            {right.desc}
          </span>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  );
}
