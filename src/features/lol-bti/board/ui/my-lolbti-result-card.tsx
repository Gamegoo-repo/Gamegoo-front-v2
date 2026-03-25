import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import type { GetMyLolBtiResultResponse } from "@/features/lol-bti/test/api";
import { LOL_BTI_TYPE_DATA } from "@/features/lol-bti/test/config";
import { toast } from "@/shared/lib/toast";
import { useAuthStore } from "@/shared/model/use-auth-store";
import { Button } from "@/shared/ui";
import LolBtiCard from "./lolbti-card";
import LolBtiChampionStats from "./lolbti-champion-stats";

export default function MyLolBtiResultCard({
	result,
}: {
	result: GetMyLolBtiResultResponse;
}) {
	const typeData = LOL_BTI_TYPE_DATA[result.type];
	const { user } = useAuthStore();
	const { data: myInfo } = useFetchMyInfo();

	return (
		<LolBtiCard
			className="w-full bg-gray-900"
			header={
				<>
					<h3 className="mb-4 font-medium text-gray-500 text-sm leading-none">
						내 롤BTI
					</h3>
					<p className="mb-6 flex flex-col items-center gap-1.5">
						<span className="font-[900] text-[40px] text-violet-600 leading-none">
							{result.type}
						</span>
						<span className="font-medium text-sm text-white">
							{typeData.title}
						</span>
					</p>
				</>
			}
			footer={
				/** TODO: 이거 누르면 뭐가 돼야 하는지 모르겠음 */
				<Button
					onClick={() => {
						toast.confirm("내 롤BTI가 복사되었습니다.");
					}}
					className="w-full rounded-xl py-5 text-sm"
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
				<span className="mb-7 inline-block text-center font-bold text-white text-xl">
					{user.name}
				</span>
			)}
			{myInfo?.championStatsResponseList && (
				<LolBtiChampionStats champions={myInfo.championStatsResponseList} />
			)}
		</LolBtiCard>
	);
}
