import React from 'react';

import { formatKDA, formatKDAStats } from '@/entities/game/lib/kda';
import ChampionStatsSection from '@/entities/game/ui/champion-stats-section';
import type { ChampionStatsResponse, MemberRecentStatsResponse } from '@/shared/api';
import { cn } from '@/shared/lib/utils';

interface RecentStatsCardProps {
  recentStats: MemberRecentStatsResponse;
  championList: ChampionStatsResponse[];
}

export default function RecentStatsCard({ recentStats, championList }: RecentStatsCardProps) {
  const kdaStats = formatKDAStats(
    recentStats.recAvgKills,
    recentStats.recAvgDeaths,
    recentStats.recAvgAssists
  );

  return (
    <section className="w-full">
      <h3 className="mb-2 text-lg font-semibold text-gray-800 mobile:text-2xl mobile:font-normal">
        최근 30게임
      </h3>
      <div className="flex flex-col gap-3 rounded-xl bg-gray-100 px-5 py-4 mobile:flex-row mobile:items-center mobile:justify-between mobile:rounded-lg mobile:px-8">
        {/* 승/패 */}
        <div className="flex w-fit items-center gap-2 mobile:flex-col">
          <span className="text-base font-bold text-gray-700 mobile:text-xl">
            {recentStats.recTotalWins}승 {recentStats.recTotalLosses}패
          </span>
          <span className="text-xs font-semibold text-gray-500 mobile:text-sm">
            {recentStats.recWinRate}%
          </span>
        </div>

        {/* KDA */}
        <div className="flex w-fit items-center gap-2 mobile:flex-col">
          <p className="flex items-center gap-1">
            {kdaStats.map((text, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <React.Fragment key={idx}>
                <span
                  className={cn(
                    'text-base font-bold text-gray-700 mobile:text-xl',
                    idx === 1 && 'text-red-500'
                  )}
                >
                  {text}
                </span>
                {idx < Number(kdaStats.length) - 1 && (
                  <span className="text-base text-gray-400 mobile:text-xl">/</span>
                )}
              </React.Fragment>
            ))}
          </p>
          <span className="text-xs font-semibold text-gray-500 mobile:text-sm">
            KDA {formatKDA(recentStats.recAvgKDA)}
          </span>
        </div>

        {/* CS */}
        <div className="flex items-center gap-2 mobile:flex-col">
          <span className="text-base font-bold text-gray-700 mobile:text-xl">
            평균 CS {(recentStats.recAvgCsPerMinute || 0).toFixed(1)}
          </span>
          <span className="text-xs font-semibold text-gray-500 mobile:text-sm">
            CS {recentStats.recTotalCs || 0}
          </span>
        </div>

        {/* 챔피언 */}
        <div className="flex flex-col gap-1 mobile:gap-2">
          <span className="text-[11px] font-medium text-gray-800 mobile:text-sm">
            최근 선호 챔피언
          </span>
          <ChampionStatsSection championList={championList} variant="profile" />
        </div>
      </div>
    </section>
  );
}
