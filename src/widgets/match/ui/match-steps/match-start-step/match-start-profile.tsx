import clsx from "clsx";
import { getPositionIcon } from "@/entities/game/lib/getPositionIcon";
import { ProfileAvatar } from "@/features/profile";
import type { MyProfileResponse, OtherProfileResponse } from "@/shared/api";
import MicOffIcon from "@/shared/assets/icons/mic_off.svg?react";
import MicOnIcon from "@/shared/assets/icons/mic_on.svg?react";

interface MatchStartProfileProps {
	user: Partial<MyProfileResponse> | Partial<OtherProfileResponse> | null;
	opponent?: boolean;
}

function MatchStartProfile({ user, opponent = false }: MatchStartProfileProps) {
	if (!user) return null;

	const MainPositionIcon = getPositionIcon(user.mainP ?? "ANY");
	const SubPositionIcon = getPositionIcon(user.subP ?? "ANY");
	const WantPositionIcon = getPositionIcon(user.wantP?.[0] ?? "ANY");
	const isMicOn = user.mike === "AVAILABLE";

	return (
		<div
			className={clsx(
				"flex flex-col items-center w-[560px] h-[560px] p-[36px] gap-[16px] bg-white border-[1px] rounded-2xl shadow-[0_0_21.3px_rgba(0,0,0,0.15)]",
				opponent ? "border-violet-600" : "border-gray-400",
			)}
		>
			{/* 헤더 */}
			<div className="flex items-center gap-2 text-center">
				<h2 className="text-3xl font-bold text-gray-900">{user.gameName}</h2>
				<p className="text-base text-gray-500">#{user.tag}</p>
			</div>

			{/* 랭크 정보 */}
			<div className="flex items-center justify-center gap-6 mb-8">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-700">솔로랭크</span>
					<span className="text-sm text-gray-500">{user.soloTier}</span>
				</div>
				<div className="w-px h-5 bg-gray-300"></div>
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-700">자유랭크</span>
					<span className="text-sm text-gray-500">{user.freeTier}</span>
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
				{user.gameStyleResponseList?.map((style) => (
					<span
						className="bg-violet-200 text-gray-700 px-4 py-2 rounded-full semi-bold-13"
						key={style.gameStyleId}
					>
						{style.gameStyleName}
					</span>
				))}
			</div>

			{/* 포지션 */}
			<div className="flex gap-[12px] h-[104px] w-full">
				<div className="bg-gray-100 flex-1 rounded-[10px] h-full px-11 py-4">
					<ul className="w-full flex justify-between h-full gap-[8px]">
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
				<div className="bg-gray-100 flex-1 rounded-[10px] h-full px-11 py-4 flex flex-col items-center justify-between">
					<span className="text-gray-700 bold-12">내가 찾는 포지션</span>

					<ul className="flex w-full justify-center gap-4 items-end">
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
