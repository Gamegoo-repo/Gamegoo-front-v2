import { useRef } from "react";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import ChampionInfo from "@/entities/game/ui/champion-info";
import TierLabel from "@/entities/game/ui/tier-label";
import { getGameStyle } from "@/entities/post/lib/get-game-style";
import { usePostDetail } from "@/entities/post/model/use-post-detail";
import WinRateTooltip from "@/entities/user/ui/win-rate-tooltip";
import InteractiveUserProfileCard from "@/features/user/interactive-user-profile-card";
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

	if (isPending) {
		return "로딩 중...";
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

	/** TODO: winRate는 왜 optional인가요... */
	const { bg: winRateBgColor, text: winRateTextColor } = getWinRateColors(
		data.winRate || 0,
	);

	return (
		<Modal isOpen={true} onClose={onClose} className="w-[555px]" ref={modalRef}>
			<div className="flex flex-col gap-5">
				{/* MODAL-CONTENT */}
				<section className="flex flex-col gap-[30px]">
					<p className="flex w-full justify-between items-center">
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
					<div className="w-full flex gap">
						<div className="w-1/2">
							<span className="mb-1.5 text-gray-800 semibold-14">솔로랭크</span>
							<TierLabel tier={data.soloTier} rank={data.soloRank} />
						</div>
						<div className="w-1/2">
							<span className="mb-1.5 text-gray-800 semibold-14">자유랭크</span>
							<TierLabel tier={data.freeTier} rank={data.freeRank} />
						</div>
					</div>
					{/** TODO: 재사용 컴포넌트 만들기 */}
					<div>
						<p className="mb-1.5 text-gray-800 semibold-14">포지션</p>
						<div className="flex gap-2 h-[98px] w-full">
							<div className="bg-white flex-1 rounded-[10px] h-full px-11 py-4">
								<ul className="w-full flex justify-between h-full">
									<li className="h-full flex flex-col items-center justify-between w-[49px]">
										<span className="text-gray-700 bold-12 w-full text-center">
											주 포지션
										</span>
										<MainPositionIcon className="w-12 text-gray-700" />
									</li>
									<li className="h-full flex flex-col items-center justify-between w-[49px]">
										<span className="text-gray-700 bold-12 w-full text-center">
											부 포지션
										</span>
										<SubPositionIcon className="w-12 text-gray-700" />
									</li>
								</ul>
							</div>
							<div className="bg-white flex-1 rounded-[10px] h-full px-11 py-4 flex flex-col items-center justify-between">
								<span className="text-gray-700 bold-12 w-full text-center">
									내가 찾는 포지션
								</span>
								<ul className="flex w-full justify-center gap-4 items-end">
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
					<div className="w-full flex gap-2">
						<p className="w-1/2">
							<span className="text-gray-800 semibold-14 text-center">
								선호 게임모드
							</span>
							<div className="bg-white rounded-[10px] flex items-center justify-start w-full px-3 py-4 medium-16 gap-1">
								<CheckIcon />
								{getGameModeTitle(data.gameMode)}
							</div>
						</p>

						<p className="w-1/2 flex flex-col gap-1.5">
							<p className="w-full flex items-center justify-between">
								<span className="text-gray-800 semibold-14">
									최근 선호 챔피언
								</span>
								<span className="text-gray-500 medium-11">최근 30게임</span>
							</p>
							{data.championStatsResponseList.length > 0 ? (
								<ul className="w-full flex items-center justify-start gap-2">
									{data.championStatsResponseList.map((champion) => {
										return (
											<li key={champion.championId}>
												<ChampionInfo {...champion} />
											</li>
										);
									})}
								</ul>
							) : (
								<div className="medium-14 h-full flex items-center text-gray-400">
									챔피언 정보가 없습니다.
								</div>
							)}
						</p>
					</div>
					<div>
						<p>
							<p className="flex items-center justify-start gap-1">
								<span className="text-gray-800 semibold-14">승률</span>
								<span className={`text-gray-500 bold-16 ${winRateTextColor}`}>
									{data.winRate}%
								</span>
								<span className="flex-1 medium-11 text-gray-500 text-end">
									현 시즌 성적 통계
								</span>
								<WinRateTooltip />
							</p>
							<div className="relative w-full h-3 rounded-full bg-gray-300">
								<div
									style={{
										width: `${data.winRate}%`,
									}}
									className={cn(
										"h-full rounded-full absolute left-0 top-0",
										winRateBgColor,
									)}
								/>
							</div>
						</p>
					</div>
					<div className="w-full">
						<p className="mb-1.5 text-gray-800 semibold-14">게임 스타일</p>
						<ul className="w-full flex gap-2">
							{data.gameStyles.map((styleId) => {
								return (
									<li
										key={styleId}
										className="flex items-center justify-center	text-gray-800 medium-16 px-3 py-1 bg-white rounded-full gap-1"
									>
										{getGameStyle(styleId)}
									</li>
								);
							})}
						</ul>
					</div>
					<div className="w-full">
						<p className="mb-1.5 text-gray-800 semibold-14">한마디</p>
						<p className="w-full break-words px-2.5 py-2 rounded-[10px] border-1 border-gray-400 mb-1.5">
							{data.contents}
						</p>
						<span className="block text-end medium-11 text-gray-500">
							게시일 : {formatDateTime(data.createdAt)}
						</span>
					</div>
				</section>

				{/* MODAL-ACTION */}
				<section className="modal-actions">
					<button
						onClick={() => {
							console.log("말 걸어보기!");
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
