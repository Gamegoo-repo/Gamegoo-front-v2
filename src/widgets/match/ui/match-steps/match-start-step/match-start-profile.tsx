import clsx from "clsx";
import { ProfileAvatar } from "@/features/profile";
import MicOffIcon from "@/shared/assets/icons/mic_off.svg?react";
import MicOnIcon from "@/shared/assets/icons/mic_on.svg?react";

interface MatchStartProfileProps {
	opponent?: boolean;
}

function MatchStartProfile({ opponent = false }: MatchStartProfileProps) {
	const tags = [
		"이기기만 하면 뭔들",
		"과도한 핑은 사절이에요",
		"랭크 올리고 싶어요",
	];

	const isMicOn = true;

	return (
		<div
			className={clsx(
				"flex flex-col items-center w-[560px] h-[560px] p-[36px] gap-[16px] bg-white border-[1px] rounded-2xl shadow-[0_0_21.3px_rgba(0,0,0,0.15)]",
				opponent ? "border-violet-600" : "border-gray-400",
			)}
		>
			{/* 헤더 */}
			<div className="flex items-center gap-2 text-center">
				<h2 className="text-3xl font-bold text-gray-900">유니콘의 비밀</h2>
				<p className="text-base text-gray-500">#KR1</p>
			</div>

			{/* 랭크 정보 */}
			<div className="flex items-center justify-center gap-6 mb-8">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-700">솔로랭크</span>
					<span className="text-sm text-gray-500">Unrank</span>
				</div>
				<div className="w-px h-5 bg-gray-300"></div>
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-gray-700">자유랭크</span>
					<span className="text-sm text-gray-500">Unrank</span>
				</div>
			</div>

			{/* 아바타 */}
			<ProfileAvatar size="xl" profileIndex={2} />

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
				{tags.map((tag) => (
					<span
						className="bg-violet-200 text-gray-700 px-4 py-2 rounded-full semi-bold-13"
						key={tag}
					>
						{tag}
					</span>
				))}
			</div>

			{/* 포지션 */}
			<div className="flex w-full items-center gap-2">
				<div className="flex items-center justify-center gap-2 w-[240px] h-[100px] bg-gray-100 rounded-lg p-2">
					<span className="semi-bold-13 text-gray-800">주 포지션</span>
					<span className="semi-bold-13 text-gray-800">부 포지션</span>
				</div>
				<div className="flex items-center justify-center gap-2 w-[240px] h-[100px] bg-gray-100 rounded-lg p-2">
					<span className="semi-bold-13 text-gray-800">내가 찾는 포지션</span>
				</div>
			</div>
		</div>
	);
}

export default MatchStartProfile;
