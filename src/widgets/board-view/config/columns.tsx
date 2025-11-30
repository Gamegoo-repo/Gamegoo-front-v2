import { Link } from "@tanstack/react-router";
import ChampionInfo from "@/entities/game/ui/champion-info";
import TierBadge from "@/entities/game/ui/tier-badge";
import MannerLevelBadge from "@/entities/user/ui/manner-level-badge";
import UserProfile from "@/entities/user/ui/user-profile";
import PostActionMenu from "@/features/board/ui/post-action-menu";
import type { BlockListResponse, BoardListResponse } from "@/shared/api";
import { formatDateSimple } from "@/shared/lib/format-date-simple";
import { cn } from "@/shared/lib/utils";
import type { UserStore } from "@/shared/model/use-auth-store";
import type { Column } from "@/shared/ui/table/table";
import SearchingPosition from "../ui/searching-positions";
import UserPositions from "../ui/user-positions";

export const getColumns = (options?: {
	user: UserStore;
	blockedUsers: BlockListResponse;
}): Column<BoardListResponse>[] => {
	return [
		{
			header: "소환사",
			width: "17%",
			accessor: (row) => {
				return (
					<Link
						to={"/users/$userId"}
						onClick={(e) => e.stopPropagation()}
						params={{ userId: row.memberId.toString() }}
						className="flex items-center gap-2"
					>
						<UserProfile id={row.profileImage} hasDropShadow={false} />
						<div className="flex flex-grow flex-col items-start gap-0.5">
							<span className="semibold-16 inline-block max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap text-gray-800">
								{row.gameName}
							</span>
							<span className="regular-13 text-gray-600">#{row.tag}</span>
						</div>
					</Link>
				);
			},
		},
		{
			header: "매너 레벨",
			width: "7%",
			accessor: (row) => <MannerLevelBadge mannerLevel={row.mannerLevel} />,
		},
		{
			header: "티어",
			width: "8%",
			accessor: (row) => {
				return <TierBadge tier={row.tier} rank={row.rank} />;
			},
		},
		{
			width: "9%",
			accessor: (row) => (
				<UserPositions mainPosition={row.mainP} subPosition={row.subP} />
			),
			header: "주/부 포지션",
		},
		{
			width: "10%",
			accessor: (row) => <SearchingPosition wantingPositions={row.wantP} />,
			header: "내가 찾는 포지션",
		},
		{
			width: "17%",
			accessor: (row) => (
				<ul className="flex justify-center gap-2">
					{row.championStatsResponseList?.map((champion) => {
						return (
							<li key={`${row.boardId}-${champion.championId}`}>
								<ChampionInfo {...champion} badgeClassName="w-[31px]" />
							</li>
						);
					})}
					{!row.championStatsResponseList ||
						(row.championStatsResponseList.length === 0 && (
							<span className="medium-14 text-center text-gray-400">
								챔피언 정보가 없습니다.
							</span>
						))}
				</ul>
			),
			header: "최근 선호 챔피언",
		},
		{
			width: "7%",
			accessor: (row) => (
				<div
					className={cn(
						"bold-16 inline-block w-full min-w-max whitespace-nowrap text-center",
						(row.winRate ?? 0) >= 50 ? "text-violet-600" : "text-gray-800",
					)}
				>
					{row.winRate?.toFixed(1)}%
				</div>
			),
			header: "승률",
		},
		{
			width: "15%",
			accessor: (row) => (
				<div className="regular-13 w-[156px] rounded-lg border border-gray-400 bg-gray-100 p-2 text-center text-gray-800">
					<p className="line-clamp-2 break-words">{row.contents}</p>
				</div>
			),
			header: "한마디",
		},
		{
			width: "8%",
			accessor: (row) => {
				return (
					<div className="medium-16 inline-block w-full min-w-max whitespace-nowrap text-center text-gray-500">
						{formatDateSimple(row.bumpTime || row.createdAt || "")}
					</div>
				);
			},
			header: "등록일시",
		},
		{
			width: "2%",
			accessor: (row) => {
				const isBlocked =
					options?.blockedUsers?.blockedMemberList.some(
						(user) => user.memberId === row.memberId,
					) || false;
				return (
					<div
						className="flex h-full w-full items-center"
						onClick={(e) => e.stopPropagation()}
					>
						{options && (
							<PostActionMenu
								postId={row.boardId}
								currentUserId={options.user.id}
								postOwnerId={row.memberId}
								isBlocked={isBlocked}
							/>
						)}
					</div>
				);
			},
			header: "",
		},
	];
};
