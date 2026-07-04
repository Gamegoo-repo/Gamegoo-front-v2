import { Link } from '@tanstack/react-router';
import type { RefObject } from 'react';

import { useFetchMannerKeywords } from '@/entities/user/api/use-fetch-manner-keywords';
import MannerLevelPopover from '@/entities/user/ui/manner-level-popover';
import UserProfile from '@/entities/user/ui/user-profile';
import type { Mike } from '@/shared/api';
import MikeTag from '@/shared/ui/mike-tag';

import BubbleTooltip from './bubble-tooltip';

export default function InteractiveUserProfileCard({
  modalRef,
  profileImage,
  gameName,
  tag,
  level,
  mike,
  memberId,
  onNavigate,
}: {
  modalRef: RefObject<HTMLDivElement | null>;
  profileImage: number;
  gameName: string;
  tag: string;
  level: number;
  mike: Mike;
  memberId: number;
  onNavigate?: () => void;
}) {
  const { data: userMannerInfo, isError, error, isFetching } = useFetchMannerKeywords(memberId);

  if (isFetching) {
    return null;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (!userMannerInfo) {
    return null;
  }
  return (
    <div className="flex items-center gap-2 mobile:gap-3">
      <p className="relative">
        <BubbleTooltip variant="sm" align="right" />
        <Link to={'/users/$userId'} params={{ userId: memberId.toString() }} onClick={onNavigate}>
          <UserProfile
            id={profileImage}
            sizeClass="w-12 h-12 mobile:w-[74px] mobile:h-[74px]"
            hasDropShadow
          />
        </Link>

        <MannerLevelPopover
          userMannerLevel={level}
          containerRef={modalRef}
          userMannerInfo={userMannerInfo}
        >
          <span className="absolute bottom-0 left-1/2 inline-block -translate-x-1/2 translate-y-1/3 cursor-pointer rounded-full bg-black/65 px-2 py-[1px] text-[9px] font-bold text-violet-300 mobile:py-0.5 mobile:text-xs">
            LV.{level}
          </span>
        </MannerLevelPopover>
      </p>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-1.5 gap-y-[1px]">
        <span className="inline-block text-base font-bold text-gray-800 mobile:text-xl">
          {gameName}
        </span>
        <div className="inline-block self-center">
          {mike && <MikeTag isMikeAvailable={mike === 'AVAILABLE'} />}
        </div>
        <span className="flex items-center justify-start self-center text-xs leading-normal font-semibold text-gray-500 mobile:text-sm">
          #{tag}
        </span>
      </div>
    </div>
  );
}
