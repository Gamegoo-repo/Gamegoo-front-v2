import clsx from "clsx";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { ProfileAvatar } from "@/features/profile";
import type {
	MyProfileResponse,
	OtherProfileResponse,
	Position,
} from "@/shared/api";
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
	if (!user) return null;

	const MainPositionIcon = getPositionIcon((user.mainP as Position) ?? "ANY");
	const SubPositionIcon = getPositionIcon((user.subP as Position) ?? "ANY");
	const WantPositionIcon = getPositionIcon(
		(user.wantP?.[0] as Position) ?? "ANY",
	);
	const isMicOn = user.mike === "AVAILABLE";

	return (
		<div
			className={clsx(
				"flex h-[560px] w-[560px] flex-col items-center gap-[16px] rounded-2xl border-[1px] bg-white p-[36px] shadow-[0_0_21.3px_rgba(0,0,0,0.15)]",
				opponent ? "border-violet-600" : "border-gray-400",
			)}
		>
			{/* 헤더 */}
			<div className="flex items-center gap-2 text-center">
				<h2 className="font-bold text-3xl text-gray-900">{user.gameName}</h2>
				<p className="text-base text-gray-500">#{user.tag}</p>
			</div>

			{/* 랭크 정보 */}
			<div className="mb-8 flex items-center justify-center gap-6">
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-700 text-sm">솔로랭크</span>
					<span className="text-gray-500 text-sm">{user.soloTier}</span>
				</div>
				<div className="h-5 w-px bg-gray-300"></div>
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-700 text-sm">자유랭크</span>
					<span className="text-gray-500 text-sm">{user.freeTier}</span>
				</div>
			</div>

			{/* 아바타 */}
			<ProfileAvatar size="xl" profileIndex={user.profileImg} />

			{/* 마이크 상태 */}
			<div className="flex flex-col items-center gap-[6px]">
				{isMicOn ? <MicOnIcon /> : <MicOffIcon />}
				<span
					className={clsx(
						"semi-bold-13",
						isMicOn ? "text-violet-600" : "text-gray-500",
					)}
				>
					{isMicOn ? "마이크 ON" : "마이크 OFF"}
				</span>
			</div>

			{/* 게임 스타일 태그 */}
			<div className="flex flex-wrap justify-center gap-2">
				{user.gameStyleResponseList?.map((style: GameStyleItem) => (
					<span
						className="semi-bold-13 rounded-full bg-violet-200 px-4 py-2 text-gray-700"
						key={style.gameStyleId}
					>
						{style.gameStyleName}
					</span>
				))}
			</div>

			{/* 포지션 */}
			<div className="flex h-[104px] w-full gap-[12px]">
				<div className="h-full flex-1 rounded-[10px] bg-gray-100 px-11 py-4">
					<ul className="flex h-full w-full justify-between gap-[8px]">
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
				<div className="flex h-full flex-1 flex-col items-center justify-between rounded-[10px] bg-gray-100 px-11 py-4">
					<span className="bold-12 text-gray-700">내가 찾는 포지션</span>

					<ul className="flex w-full items-end justify-center gap-4">
						<li className="flex flex-col items-center justify-between">
							<WantPositionIcon className="w-12 text-gray-700" />
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default MatchStartProfile;
