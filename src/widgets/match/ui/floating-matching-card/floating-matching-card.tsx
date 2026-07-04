import { useLocation, useRouter } from '@tanstack/react-router';

import HeartIcon from '@/shared/assets/icons/wait_heart.svg?react';
import { Button } from '@/shared/ui';

import { useMatchFunnelStore } from '../../hooks';
import { matchFlow } from '../../lib/match-flow';
import { useMatchUiStore } from '../../model/store/useMatchUiStore';
import { CancelMatchingIcon } from './icons/cancel-matching-icon';
import { ExpandMatchingIcon } from './icons/expand-matching-icon';

export const FloatingMatchingCard = () => {
  const router = useRouter();
  const { isMatching, timeLeft, sessionId } = useMatchUiStore();
  const { setStep } = useMatchFunnelStore.getState();
  const location = useLocation();
  const isMatchPage = location.pathname.startsWith('/match');
  if (!isMatching) return null;
  if (isMatchPage) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExpandMatchingPage = () => {
    router.navigate({ to: '/match' });
  };

  const handleCancelMatching = () => {
    matchFlow.cancel(sessionId);
    setStep('profile');
  };

  return (
    <section className="animate-slide-in fixed bottom-6 left-6 z-50 h-[108px] w-[191px] rounded-[11px] border border-gray-300 bg-gray-100 md:h-[185px] md:w-[328px] md:rounded-[20px]">
      <header className="absolute z-1 flex w-full justify-between p-[6px] md:p-3">
        <Button
          variant="ghost"
          className="p-[6px] md:p-3 [&:has(>svg)]:px-[6px] md:[&:has(>svg)]:px-3"
          onClick={handleCancelMatching}
        >
          <CancelMatchingIcon />
        </Button>
        <Button
          variant="ghost"
          className="p-[6px] md:p-3 [&:has(>svg)]:px-[6px] md:[&:has(>svg)]:px-3"
          onClick={handleExpandMatchingPage}
        >
          <ExpandMatchingIcon />
        </Button>
      </header>
      <div className="animate-fade-in flex h-full flex-col items-center justify-center gap-2 py-3">
        <div className="animate-grow-shrink">
          <HeartIcon className="h-[54px] w-[54px] md:h-[92px] md:w-[92px]" />
        </div>
        <div className="flex w-full flex-col items-center">
          {/* 랜덤 메세지 */}
          <span className="text-[8px] text-gray-800 md:text-[11px]">어떤 사람이 나올까요?</span>
          {/* 시간 표시 */}
          <div className="regular-11 text-gray-600">
            <span className="bold-11 text-violet-600">{formatTime(timeLeft)}&nbsp;</span>/ 5:00
          </div>
        </div>
      </div>
    </section>
  );
};
