import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useRef } from "react";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { userKeys } from "@/entities/user/config/query-keys";
import { ProfileAvatar } from "@/features/profile";
import MannerProfileAvatar from "@/features/profile/manner-profile-avatar";
import type {
	MyProfileResponse,
	OtherProfileResponse,
	Position,
} from "@/shared/api";
import { api } from "@/shared/api";
import MicOffIcon from "@/shared/assets/icons/mic_off.svg?react";
import MicOnIcon from "@/shared/assets/icons/mic_on.svg?react";
import type {
	GameStyleItem,
	OpponentProfilePayload,
} from "@/widgets/match/lib/matching-types";

interface MatchStartProfileProps {
	user:
		| Partial<MyProfileResponse>
		| Partial<OtherProfileResponse>
		| Partial<OpponentProfilePayload>
		| null;
	opponent?: boolean;
}

function MatchStartProfile({ user, opponent = false }: MatchStartProfileProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const memberId =
		typeof (user as Partial<OtherProfileResponse>)?.id === "number"
			? ((user as Partial<OtherProfileResponse>).id as number)
			: (
					user as Partial<OpponentProfilePayload>
				)?.memberId;

	const { data: userMannerInfo } = useQuery({
		queryKey: userKeys.mannerDetail(memberId as number, "keywords"),
		queryFn: async () => {
			const response = await api.private.manner.getMannerKeywordInfo(
				memberId as number,
			);
			return response.data?.data || null;
		},
		enabled: opponent && typeof memberId === "number",
	});

	if (!user) return null;

	const MainPositionIcon = getPositionIcon((user.mainP as Position) ?? "ANY");
	const SubPositionIcon = getPositionIcon((user.subP as Position) ?? "ANY");
	const WantPositionIcon = getPositionIcon(
		(user.wantP?.[0] as Position) ?? "ANY",
	);

	const isMicOn = user.mike === "AVAILABLE";

	const mannerLevel =
		opponent &&
		typeof (user as Partial<{ mannerLevel: number }>).mannerLevel === "number"
			? ((user as Partial<{ mannerLevel: number }>).mannerLevel as number)
			: undefined;

	return (
		<div
			className={clsx(
				`
        flex flex-col items-center rounded-2xl border bg-white
        shadow-[0_0_21.3px_rgba(0,0,0,0.15)]
        w-full max-w-[560px]
        h-auto md:h-[600px]
        p-5 md:p-[36px]
        gap-3 md:gap-[16px]
        `,
				opponent ? "border-violet-600" : "border-gray-400",
			)}
		>
			{/* 헤더 */}
			<div className="flex items-center gap-1 md:gap-2 text-center">
				<h2 className="font-bold text-xl md:text-3xl text-gray-900">
					{user.gameName}
				</h2>
				<p className="text-sm md:text-base text-gray-500">
					#{user.tag}
				</p>
			</div>

			{/* 랭크 정보 */}
			<div className="mb-4 md:mb-8 flex items-center justify-center gap-4 md:gap-6">
				<div className="flex items-center gap-1 md:gap-2">
					<span className="font-medium text-xs md:text-sm text-gray-700">
						솔로랭크
					</span>
					<span className="text-xs md:text-sm text-gray-500">
						{user.soloTier}
					</span>
				</div>

				<div className="h-4 md:h-5 w-px bg-gray-300" />

				<div className="flex items-center gap-1 md:gap-2">
					<span className="font-medium text-xs md:text-sm text-gray-700">
						자유랭크
					</span>
					<span className="text-xs md:text-sm text-gray-500">
						{user.freeTier}
					</span>
				</div>
			</div>

			{/* 아바타 */}
			{opponent && userMannerInfo && mannerLevel ? (
				<MannerProfileAvatar
					containerRef={containerRef}
					profileIndex={user.profileImg ?? 0}
					userMannerInfo={userMannerInfo}
					mannerLevel={mannerLevel}
				/>
			) : (
				<div className="scale-90 md:scale-100">
					<ProfileAvatar size="xl" profileIndex={user.profileImg} />
				</div>
			)}

			{/* 마이크 상태 */}
			<div className="flex flex-col items-center gap-1 md:gap-[6px]">
				<div className="scale-90 md:scale-100">
					{isMicOn ? <MicOnIcon /> : <MicOffIcon />}
				</div>
				<span
					className={clsx(
						"text-xs md:semi-bold-13",
						isMicOn ? "text-violet-600" : "text-gray-500",
					)}
				>
					{isMicOn ? "마이크 ON" : "마이크 OFF"}
				</span>
			</div>

			{/* 게임 스타일 */}
			<div className="flex flex-wrap justify-center gap-2">
				{user.gameStyleResponseList?.map((style: GameStyleItem) => (
					<span
						key={style.gameStyleId}
						className="
              rounded-full bg-violet-200
              px-3 py-1 md:px-4 md:py-2
              text-xs md:semi-bold-13
              text-gray-700
            "
					>
						{style.gameStyleName}
					</span>
				))}
			</div>

			{/* 포지션 */}
			<div className="flex w-full gap-2 md:gap-[12px]">
				<div className="flex-1 rounded-[10px] bg-gray-100 px-4 md:px-11 py-3 md:py-4">
					<ul className="flex h-full w-full justify-between gap-2">
						<li className="flex flex-col items-center justify-between">
							<span className="text-[11px] md:bold-12 text-gray-700">
								주 포지션
							</span>
							<MainPositionIcon className="w-9 md:w-12 text-gray-700" />
						</li>

						<li className="flex flex-col items-center justify-between">
							<span className="text-[11px] md:bold-12 text-gray-700">
								부 포지션
							</span>
							<SubPositionIcon className="w-9 md:w-12 text-gray-700" />
						</li>
					</ul>
				</div>

				<div className="flex flex-1 flex-col items-center justify-between rounded-[10px] bg-gray-100 px-4 md:px-11 py-3 md:py-4">
					<span className="text-[11px] md:bold-12 text-gray-700">
						내가 찾는 포지션
					</span>

					<WantPositionIcon className="w-9 md:w-12 text-gray-700" />
				</div>
			</div>
		</div>
	);
}

export default MatchStartProfile;
