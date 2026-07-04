import { formatKDA, formatKDAStats } from '@/entities/game/lib/kda';
import ChampionStatsSection from '@/entities/game/ui/champion-stats-section';
import UserProfileHeader from '@/features/profile/user-profile-header';
import { UserActionMenu } from '@/features/user/action-menu';
import UserActionButtons from '@/features/user/buttons/user-action-buttons';
import type { MannerKeywordListResponse, MannerResponse, OtherProfileResponse } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { useResponsive } from '@/shared/model/responsive-context';
import MannerKeywordsCard from './manner-keywords-card';
import MannerLevelCard from './manner-level-card';
import type { UserRelationshipStatus } from './model/user-info.types';
import UserProfileCard from './user-profile-card';
import UserProfileCardMobile from './user-profile-card-mobile';

interface UserInfoWidgetProps {
  relationshipStatus: UserRelationshipStatus;
  userProfileData: OtherProfileResponse;
  userMannerKeywordData: MannerKeywordListResponse;
  userMannerLevelData: MannerResponse;
}

export default function UserInfoWidget({
  relationshipStatus,
  userProfileData,
  userMannerKeywordData,
  userMannerLevelData,
}: UserInfoWidgetProps) {
  const {
    recTotalWins = 0,
    recTotalCs,
    recTotalLosses = 0,
    recWinRate = 0,
    recAvgKDA = 0,
    recAvgKills = 0,
    recAvgDeaths = 0,
    recAvgAssists = 0,
    recAvgCsPerMinute,
  } = userProfileData.memberRecentStats || {};

  const { isMobile } = useResponsive();

  return (
    <div className="mb-48 flex h-full w-full flex-col gap-9 px-5 mobile:px-0 mobile:pt-[68px]">
      <section className="flex w-full flex-col mobile:gap-5">
        <UserProfileHeader relationshipStatus={relationshipStatus}>
          {relationshipStatus === 'me' ? '나의 프로필' : `${userProfileData.gameName}님의 프로필`}
        </UserProfileHeader>
        {isMobile && (
          <UserProfileCardMobile
            data={userProfileData}
            button={
              <UserActionButtons
                userId={userProfileData.id}
                relationshipStatus={relationshipStatus}
              />
            }
            menu={
              <UserActionMenu userId={userProfileData.id} relationshipStatus={relationshipStatus} />
            }
          />
        )}
        {!isMobile && (
          <UserProfileCard
            data={userProfileData}
            button={
              <UserActionButtons
                userId={userProfileData.id}
                relationshipStatus={relationshipStatus}
              />
            }
            menu={
              <UserActionMenu userId={userProfileData.id} relationshipStatus={relationshipStatus} />
            }
          />
        )}
      </section>
      <div className="grid grid-cols-1 grid-rows-[auto_auto_auto] gap-y-9 mobile:grid-cols-[1fr_auto_auto] mobile:grid-rows-[minmax(264px,auto)_auto] mobile:gap-x-3">
        <MannerLevelCard
          userProfile={{ gameName: userProfileData.gameName }}
          userMannerLevelData={userMannerLevelData}
        />
        <MannerKeywordsCard
          title={'받은 매너 평가'}
          keywords={userMannerKeywordData.mannerKeywords.slice(0, 6)}
          type="positive"
        />
        <MannerKeywordsCard
          title={'받은 비매너 평가'}
          keywords={userMannerKeywordData.mannerKeywords.slice(6)}
          type="negative"
        />
        <section className="w-full">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 mobile:text-2xl mobile:font-normal">
            최근 30게임
          </h3>

          <div className="flex flex-col gap-3 rounded-xl bg-gray-100 px-5 py-4 mobile:flex-row mobile:items-center mobile:justify-between mobile:rounded-lg mobile:px-8">
            <div className="flex w-fit items-center gap-2 mobile:flex-col">
              <span className="text-base font-bold text-gray-700 mobile:text-xl">{`${recTotalWins}승 ${recTotalLosses}패`}</span>
              <span className="text-xs font-semibold text-gray-500 mobile:text-sm">
                {recWinRate}%
              </span>
            </div>

            <div className="flex w-fit items-center gap-2 mobile:flex-col">
              <p className="flex items-center gap-1">
                {formatKDAStats(recAvgKills, recAvgDeaths, recAvgAssists).map((text, idx) => {
                  return (
                    <>
                      <span
                        className={cn(
                          'text-base font-bold text-gray-700 mobile:text-xl',
                          idx === 1 && 'text-red-500'
                        )}
                      >
                        {text}
                      </span>

                      {idx !== 2 && (
                        <span className="text-base text-gray-400 mobile:text-xl">/</span>
                      )}
                    </>
                  );
                })}
              </p>
              <span className="text-xs font-semibold text-gray-500 mobile:text-sm">
                KDA {formatKDA(recAvgKDA)}
              </span>
            </div>

            <div className="flex items-center gap-2 mobile:flex-col">
              <span className="text-base font-bold text-gray-700 mobile:text-xl">
                평균 CS {(recAvgCsPerMinute || 0).toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-gray-500 mobile:text-sm">
                CS {recTotalCs || 0}
              </span>
            </div>
            <div className="flex flex-col gap-1 mobile:gap-2">
              <span className="text-[11px] font-medium text-gray-800 mobile:text-sm">
                최근 선호 챔피언
              </span>

              <ChampionStatsSection
                championList={userProfileData.championStatsResponseList}
                variant="profile"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
