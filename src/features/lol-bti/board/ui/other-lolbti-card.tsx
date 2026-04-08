import { Link } from "@tanstack/react-router";
import { LOL_BTI_TYPE_DATA } from "@/features/lol-bti/test/config";
import { useSendFriendRequest } from "@/features/user/hooks/use-send-friend-request";
import { api, type LolBtiRecommendation } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import CompatibilityHeart from "./compatibility-heart";
import LolBtiCard from "./lolbti-card";
import LolBtiChampionStats from "./lolbti-champion-stats";
import { useOpenChatroom } from "@/features/chat/hooks/use-open-chatroom";
import { useAuthenticatedAction } from "@/shared/hooks/use-authenticated-action";
import type { MyLolBtiRecommendation } from "@/shared/api/lolbti/types";
import { Button } from "@gamegoo-ui/design-system";

type CompatibilityLevel = "full" | "half" | "empty";

const getCompatibilityLevel = (score: number): CompatibilityLevel => {
	if (score >= 90) {
		return "full";
	}
	if (score >= 50) {
		return "half";
	}
	return "empty";
};

const COMPATIBILITY_LABEL: Record<CompatibilityLevel, string> = {
	full: "나와 잘 맞는 유형",
	half: "잘 맞을 수도 있고 아닐 수도 있는 유형",
	empty: "나와 잘 안 맞는 유형",
};

export default function OtherLolBtiResultCard({
	result,
}: {
	result: LolBtiRecommendation | MyLolBtiRecommendation;
}) {
	const typeData = LOL_BTI_TYPE_DATA[result.rollBtiType];
	const { mutate: sendFriendRequest } = useSendFriendRequest(result.memberId);
	// const _handleAddFriend = useAuthenticatedAction(() => sendFriendRequest());

	const compatibilityLevel =
		"compatibilityScore" in result
			? getCompatibilityLevel(result.compatibilityScore)
			: null;

	const openChatRoom = useOpenChatroom();

	const handleStartChat = useAuthenticatedAction(async () => {
		openChatRoom(
			async () =>
				await api.private.chat.startChatroomByMemberId(result.memberId),
		);
	});

	return (
		<Link
			className="block w-full"
			to="/users/$userId"
			params={{ userId: result.memberId.toString() }}
		>
			<LolBtiCard
				className="bg-gray-100"
				header={
					<>
						<h3
							className={cn(
								"mb-4 font-medium text-gray-500 text-sm leading-none",
								!compatibilityLevel && "invisible",
							)}
						>
							{compatibilityLevel
								? COMPATIBILITY_LABEL[compatibilityLevel]
								: "\u00A0"}
						</h3>
						<p className={"mb-6 flex flex-col items-center gap-1.5"}>
							<span className="font-[900] text-[40px] text-violet-600 leading-none">
								{result.rollBtiType}
							</span>
							<span className="font-medium text-sm text-violet-600">
								{typeData.title}
							</span>
						</p>
					</>
				}
				footer={
					<div className="flex w-full items-center gap-2">
						{/** TODO: 디자인 나오면 현재 롤비티아이 카드의 유저와의 관계에 따라 렌더링해야함  */}
						{/* {false && (
							<Button
								className="w-full flex-1 rounded-xl py-5 text-sm"
								onClick={handleAddFriend}
							>
								친구추가
							</Button>
						)} */}
						<Button
							size="lg"
							variant="black"
							onClick={(e) => {
								e.preventDefault();
								handleStartChat();
							}}
							className="w-full! rounded-xl!"
						>
							말 걸어보기
						</Button>
					</div>
				}
			>
				<div className="relative">
					{compatibilityLevel && (
						<div className="-translate-y-[25%] absolute top-0 right-0 translate-x-[25%]">
							<CompatibilityHeart compatibilityLevel={compatibilityLevel} />
						</div>
					)}
					<img
						className="mb-3 size-[132px] rounded-full"
						src={`/assets/images/results/${typeData.imageIndex}.png`}
						alt={`${result.rollBtiType} 결과 이미지`}
					/>
				</div>
				<span className="mb-7 inline-block text-center font-bold text-black text-xl">
					{result.gameName}
				</span>
				<LolBtiChampionStats
					className="bg-white"
					champions={result.championStatsResponseList}
				/>
			</LolBtiCard>
		</Link>
	);
}
