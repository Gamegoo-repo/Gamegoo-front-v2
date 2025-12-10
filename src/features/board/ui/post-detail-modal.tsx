import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useChatStore } from "@/entities/chat";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import ChampionStatsSection from "@/entities/game/ui/champion-stats-section";
import RankInfo from "@/entities/game/ui/rank-info";
import { getGameStyle } from "@/entities/post/lib/get-game-style";
import { usePostDetail } from "@/entities/post/model/use-post-detail";
import WinRateTooltip from "@/entities/user/ui/win-rate-tooltip";
import InteractiveUserProfileCard from "@/features/user/interactive-user-profile-card";
import type { ChatroomResponse } from "@/shared/api";
import { api } from "@/shared/api";
import CheckIcon from "@/shared/assets/icons/ic-check.svg?react";
import { formatDateTime } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import Modal from "@/shared/ui/modal/modal";
import { getGameModeTitle } from "../lib/getGameModeTitle";

export default function PostDetailModal({
	postId,
	onClose,
}: {
	postId: number;
	onClose: () => void;
}) {
	const { isPending, data, isError, error } = usePostDetail(postId);
	const modalRef = useRef<HTMLDivElement>(null);
	const {
		setChatroom,
		setChatDialogType,
		openDialog,
		setSystemData,
		clearSystemData,
	} = useChatDialogStore();
	const queryClient = useQueryClient();
	const { updateChatroom } = useChatStore();

	if (isPending) {
		return null;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (!data || !data.memberId) {
		return <div>게시글 정보를 불러오는 데 실패했습니다.</div>;
	}

	const MainPositionIcon = getPositionIcon(data.mainP);
	const SubPositionIcon = getPositionIcon(data.subP);
	const wantPositions = data.wantP.map((pos) => getPositionIcon(pos));

	const { bg: winRateBgColor, text: winRateTextColor } = getWinRateColors(
		data.winRate || 0,
	);

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			className="w-[555px]"
			isBackdropClosable={false}
		>
			<div className="flex flex-col gap-5" ref={modalRef}>
				{/* MODAL-CONTENT */}
				<section className="flex flex-col gap-[30px]">
					<p className="flex w-full items-center justify-between">
						<InteractiveUserProfileCard
							memberId={data.memberId}
							modalRef={modalRef}
							profileImage={data.profileImage}
							gameName={data.gameName}
							tag={data.tag}
							mike={data.mike}
							level={data.mannerLevel}
						/>
					</p>
					<div className="gap flex w-full">
						<div className="w-1/2">
							<RankInfo
								tier={data.soloTier}
								rank={data.soloRank}
								label="솔로랭크"
								variant={"modal"}
							/>
						</div>
						<div className="w-1/2">
							<RankInfo
								tier={data.freeTier}
								rank={data.freeRank}
								label="자유랭크"
								variant={"modal"}
							/>
						</div>
					</div>
					{/** TODO: 재사용 컴포넌트 만들기 */}
					<div>
						<p className="semibold-14 mb-1.5 text-gray-800">포지션</p>
						<div className="flex h-[98px] w-full gap-2">
							<div className="h-full flex-1 rounded-[10px] bg-white px-11 py-4">
								<ul className="flex h-full w-full justify-between">
									<li className="flex h-full w-[49px] flex-col items-center justify-between">
										<span className="bold-12 w-full text-center text-gray-700">
											주 포지션
										</span>
										<MainPositionIcon className="w-12 text-gray-700" />
									</li>
									<li className="flex h-full w-[49px] flex-col items-center justify-between">
										<span className="bold-12 w-full text-center text-gray-700">
											부 포지션
										</span>
										<SubPositionIcon className="w-12 text-gray-700" />
									</li>
								</ul>
							</div>
							<div className="flex h-full flex-1 flex-col items-center justify-between rounded-[10px] bg-white px-11 py-4">
								<span className="bold-12 w-full text-center text-gray-700">
									내가 찾는 포지션
								</span>
								<ul className="flex w-full items-end justify-center gap-4">
									{wantPositions.map((wantPosition) => {
										const PositionIcon = wantPosition;
										return (
											<li
												key={`position-${crypto.randomUUID()}`}
												className="flex flex-col items-center justify-between"
											>
												<PositionIcon className="w-12 text-gray-700" />
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
					<div className="flex w-full gap-2">
						<p className="w-1/2">
							<span className="semibold-14 text-center text-gray-800">
								선호 게임모드
							</span>
							<div className="medium-16 flex w-full items-center justify-start gap-1 rounded-[10px] bg-white px-3 py-4">
								<CheckIcon />
								{getGameModeTitle(data.gameMode)}
							</div>
						</p>

						<p className="flex w-1/2 flex-col gap-1.5">
							<p className="flex w-full items-center justify-between">
								<span className="semibold-14 text-gray-800">
									최근 선호 챔피언
								</span>
								<span className="medium-11 text-gray-500">최근 30게임</span>
							</p>
							<ChampionStatsSection
								variant="modal"
								championList={data.championStatsResponseList}
							/>
						</p>
					</div>
					<div>
						<p>
							<p className="flex items-center justify-start gap-1">
								<span className="semibold-14 text-gray-800">승률</span>
								<span className={`bold-16 text-gray-500 ${winRateTextColor}`}>
									{data.winRate}%
								</span>
								<span className="medium-11 flex-1 text-end text-gray-500">
									현 시즌 성적 통계
								</span>
								<WinRateTooltip />
							</p>
							<div className="relative h-3 w-full rounded-full bg-gray-300">
								<div
									style={{
										width: `${data.winRate}%`,
									}}
									className={cn(
										"absolute top-0 left-0 h-full rounded-full",
										winRateBgColor,
									)}
								/>
							</div>
						</p>
					</div>
					<div className="w-full">
						<p className="semibold-14 mb-1.5 text-gray-800">게임 스타일</p>
						<ul className="flex w-full gap-2">
							{data.gameStyles.map((styleId) => {
								return (
									<li
										key={styleId}
										className="medium-16 flex items-center justify-center gap-1 rounded-full bg-white px-3 py-1 text-gray-800"
									>
										{getGameStyle(styleId)}
									</li>
								);
							})}
						</ul>
					</div>
					<div className="w-full">
						<p className="semibold-14 mb-1.5 text-gray-800">한마디</p>
						<p className="mb-1.5 w-full break-words rounded-[10px] border-1 border-gray-400 px-2.5 py-2">
							{data.contents}
						</p>
						<span className="medium-11 block text-end text-gray-500">
							게시일 : {formatDateTime(data.createdAt)}
						</span>
					</div>
				</section>

				{/* MODAL-ACTION */}
				<section className="modal-actions">
					<button
						onClick={async () => {
							try {
								const response =
									await api.private.chat.startChatroomByBoardId(postId);
								const chatroomData = response.data?.data;

								if (chatroomData?.uuid) {
									if (chatroomData.system) {
										setSystemData({
											flag: chatroomData.system.flag,
											boardId: chatroomData.system.boardId,
										});
									} else {
										clearSystemData();
									}
									const chatroom: ChatroomResponse = {
										chatroomId: 0,
										uuid: chatroomData.uuid,
										targetMemberId: chatroomData.memberId,
										targetMemberName: chatroomData.gameName,
										targetMemberImg: chatroomData.memberProfileImg,
										friend: chatroomData.friend,
										blocked: chatroomData.blocked,
										blind: chatroomData.blind,
										notReadMsgCnt: 0,
										friendRequestMemberId:
											chatroomData.friendRequestMemberId || 0,
										lastMsg: "",
										lastMsgAt: "",
										lastMsgTimestamp: 0,
									};
									// Preload enter data to ensure system flag is available before first send
									await queryClient.prefetchQuery({
										queryKey: ["enter-chatroom", chatroom.uuid],
										queryFn: async () => {
											const enterRes = await api.private.chat.enterChatroom(
												chatroom.uuid,
											);
											return enterRes.data;
										},
									});
									// Optimistically update chatroom list and trigger server refetch
									updateChatroom(chatroom);
									void queryClient.invalidateQueries({
										queryKey: ["chatrooms"],
									});
									setChatroom(chatroom);
									setChatDialogType("chatroom");
									openDialog();
									onClose();
								}
							} catch (e) {
								console.error("채팅방 시작 실패:", e);
							}
						}}
						type="button"
						className="primary-btn w-full py-[18px] disabled:bg-gray-400"
					>
						말 걸어보기
					</button>
				</section>
			</div>
		</Modal>
	);
}
