import { useFetchMyInfo } from '@/entities/user/api/use-fetch-my-info';
import type { GetMyLolBtiResultResponse } from '@/features/lol-bti/test/api';
import { LOL_BTI_TYPE_DATA } from '@/features/lol-bti/test/config';
import { toast } from '@/shared/lib/toast';
import { Button } from '@gamegoo-ui/design-system';
import { useAuthStore } from '@/shared/model/use-auth-store';
import LolBtiCard from './lolbti-card';
import LolBtiChampionStats from './lolbti-champion-stats';
import { Skeleton } from '@/shared/ui/skeleton/skeleton-ui';

export default function MyLolBtiResultCard({ result }: { result: GetMyLolBtiResultResponse }) {
  const typeData = LOL_BTI_TYPE_DATA[result.type];
  const { user } = useAuthStore();
  const { data: myInfo, isPending } = useFetchMyInfo();

  return (
    <LolBtiCard
      className="w-full bg-gray-900"
      header={
        <>
          <h3 className="mb-4 text-sm leading-none font-medium text-gray-500">내 롤BTI</h3>
          <p className="mb-6 flex flex-col items-center gap-1.5">
            <span className="text-[40px] leading-none font-[900] text-violet-600">
              {result.type}
            </span>
            <span className="text-sm font-medium text-white">{typeData.title}</span>
          </p>
        </>
      }
      footer={
        <Button
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            toast.confirm('내 롤BTI가 복사되었습니다.');
          }}
          className="w-full! rounded-xl!"
        >
          내 롤BTI 공유하기
        </Button>
      }
    >
      <img
        className="mb-3 size-[132px] rounded-full"
        src={`/assets/images/results/${typeData.imageIndex}.png`}
        alt={`${result.type} 결과 이미지`}
      />
      {user && (
        <span className="mb-7 inline-block text-center text-xl font-bold text-white">
          {user.name}
        </span>
      )}
      {isPending && (
        <Skeleton
          width={'100%'}
          height={73}
          variant={'rounded'}
          className="mb-4 w-full min-w-[244px] bg-gray-800"
        />
      )}
      {myInfo?.championStatsResponseList && (
        <LolBtiChampionStats champions={myInfo.championStatsResponseList} />
      )}
    </LolBtiCard>
  );
}
