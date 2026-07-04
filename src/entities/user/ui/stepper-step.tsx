import type { ReactNode } from 'react';
import CheckIcon from '@/shared/assets/icons/ic-manner-check.svg?react';
import { STEPPER_COLORS } from '../config/stepper-colors';

interface StepperStepProps {
  currentLevel: number; // 맵핑 중인 현재 레벨 숫자 (1~5)
  userLevel: number; // 유저의 실제 레벨
  rankPercentile: number | undefined;
}
export default function StepperStep({ currentLevel, userLevel, rankPercentile }: StepperStepProps) {
  if (currentLevel > userLevel) {
    return <UnCheckedStepItem key={currentLevel} level={currentLevel} />;
  } else if (currentLevel === userLevel) {
    // 유저의 현재 레벨인 노드의 경우
    return (
      <div className="relative flex flex-col">
        <CheckedStepItem key={currentLevel} level={currentLevel}>
          <div
            className="absolute -top-5 flex -translate-y-[100%] flex-col items-center gap-1 text-[9px] font-bold text-nowrap mobile:-top-14 mobile:text-xs"
            style={{
              color: currentLevel > 3 ? STEPPER_COLORS[currentLevel - 1] : STEPPER_COLORS[1],
            }}
          >
            {rankPercentile && (
              <>
                <span>상위 {rankPercentile}%</span>
                <div
                  className="h-0 w-0 border-x-4 border-t-8 border-x-transparent"
                  style={{
                    borderTopColor:
                      currentLevel > 3 ? STEPPER_COLORS[currentLevel - 1] : STEPPER_COLORS[1],
                  }}
                />
              </>
            )}
          </div>
        </CheckedStepItem>
      </div>
    );
  } else {
    return <CheckedStepItem key={currentLevel} level={currentLevel} />;
  }
}

const CheckedStepItem = ({ level, children }: { level: number; children?: ReactNode }) => {
  return (
    <li className="relative flex flex-col items-center justify-center">
      {children}
      <LevelText level={level} />
      <div
        className="flex h-6 w-6 items-center justify-center rounded-full mobile:h-10 mobile:w-10"
        style={{ backgroundColor: STEPPER_COLORS[level - 1] }}
      >
        <CheckIcon className="w-[14px] mobile:w-[22px]" />
      </div>
    </li>
  );
};

const UnCheckedStepItem = ({ level }: { level: number }) => {
  return (
    <li className="relative flex flex-col items-center justify-center">
      <span className="absolute top-0 inline-block -translate-y-[100%] text-[9px] font-medium text-nowrap text-gray-800 mobile:-top-2 mobile:-translate-y-[100%] mobile:text-sm mobile:font-bold">
        Lv {level}
      </span>
      <div className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-4 border-gray-800 bg-gray-100 mobile:h-[20px] mobile:w-[20px] mobile:border-[5px] mobile:p-0.5" />
    </li>
  );
};

const LevelText = ({ level }: { level: number }) => {
  return (
    <span className="absolute top-0 -translate-y-[100%] text-[9px] font-medium text-violet-400 mobile:-top-2 mobile:-translate-y-[100%] mobile:text-sm mobile:font-bold">
      Lv {level}
    </span>
  );
};
