import { clsx } from "clsx";
import { useEffect, useState } from "react";
import HeartIcon from "@/shared/assets/icons/wait_heart.svg?react";

const MESSAGE_CHANGE_INTERVAL = 5000; // 5초
const FADE_TRANSITION_DELAY = 500; // 0.5초

interface MatchLoadingCardProps {
	isMobile?: boolean;
	timeLeft: number;
	tierCounts?: Record<string, number>;
	userTier?: string;
}

const messagesWithTierN = Object.freeze([
	"나와 같은 티어의 n명이 매칭 중이에요!",
]);

const messagesWithTotalN = Object.freeze([
	"지금 n명이 매칭을 기다리고 있어요!",
	"n명의 플레이어가 매칭을 기다리고 있어요!",
	"n명의 플레이어가 매칭 중입니다!",
]);

const messagesWithoutN = Object.freeze([
	"어떤 플레이어와 매칭될지 기대해보세요!",
	"매칭이 완료 되면 10초 후에 새로운 채팅방이 열려요!",
	"누가 팀원이 될지 설레지 않나요?",
	"매칭 지연 중? 게시판에서 친구를 찾아보세요!",
	"어떤 플레이어와 팀을 이룰지 기대하세요!",
	"매칭이 늦어지면 게시판을 활용해보세요!",
]);

function MatchLoadingCard({
	timeLeft,
	tierCounts = {},
	userTier = "UNRANKED",
}: MatchLoadingCardProps) {
	const [currentMessage, setCurrentMessage] = useState<string>("");
	const [textVisible, setTextVisible] = useState<boolean>(true);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const showMessage = () => {
		setTextVisible(false);

		setTimeout(() => {
			const totalMessages = [
				...messagesWithTierN,
				...messagesWithTotalN,
				...messagesWithoutN,
			];
			const randomMessage =
				totalMessages[Math.floor(Math.random() * totalMessages.length)];

			const tierUserCount = tierCounts[userTier] ?? 0;
			const totalUserCount = tierCounts.total ?? 0;

			if (messagesWithTierN.includes(randomMessage)) {
				setCurrentMessage(
					randomMessage.replace(/n/g, tierUserCount.toString()),
				);
			} else if (messagesWithTotalN.includes(randomMessage)) {
				setCurrentMessage(
					randomMessage.replace(/n/g, totalUserCount.toString()),
				);
			} else {
				setCurrentMessage(randomMessage);
			}

			setTextVisible(true);
		}, FADE_TRANSITION_DELAY);
	};

	useEffect(() => {
		showMessage();
		const interval = setInterval(showMessage, MESSAGE_CHANGE_INTERVAL);
		return () => clearInterval(interval);
	}, [tierCounts, userTier]);

	return (
		<div className="w-[560px] h-[560px] p-[30px_80px] rounded-[30px] bg-gray-100 flex flex-col items-center justify-center gap-[42px] text-gray-800 regular-25 animate-fade-in transition-opacity duration-500">
			{/* 하트 애니메이션 */}
			<div className="animate-grow-shrink">
				<HeartIcon width={225} height={225} className="text-violet-600" />
			</div>

			{/* 랜덤 메세지 */}
			<div className="flex flex-col items-center gap-[4px]">
				<div
					className={clsx(
						"transition-opacity duration-300 regular-20 h-[60px] flex items-center justify-center text-center",
						textVisible
							? "opacity-100 animate-fade-in"
							: "opacity-0 animate-fade-out",
					)}
				>
					{currentMessage}
				</div>

				{/* 시간 표시 */}
				<div className="text-gray-700 light-32">
					<span className="text-violet-600 bold-32">
						{formatTime(timeLeft)}&nbsp;
					</span>
					/ 5:00
				</div>
			</div>
		</div>
	);
}

export default MatchLoadingCard;
