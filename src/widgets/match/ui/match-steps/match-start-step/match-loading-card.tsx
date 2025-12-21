import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
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
	// 메시지를 한 사이클 동안 중복 없이 보여주기 위한 큐(셔플된 인덱스 리스트)
	const messageQueueRef = useRef<number[]>([]);
	const lastMessageIndexRef = useRef<number | null>(null);

	const buildMessageQueue = (len: number, lastIndex: number | null) => {
		const indices = Array.from({ length: len }, (_, i) => i);
		// Fisher–Yates shuffle
		for (let i = indices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[indices[i], indices[j]] = [indices[j], indices[i]];
		}
		// 새 사이클 첫 메시지가 직전과 동일하면 한 번 swap해서 연속 중복 방지
		if (indices.length > 1 && lastIndex !== null && indices[0] === lastIndex) {
			[indices[0], indices[1]] = [indices[1], indices[0]];
		}
		return indices;
	};

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

			if (totalMessages.length === 0) return;

			// 큐가 비었으면 새로 셔플해서 한 번씩 보여주도록 구성
			if (messageQueueRef.current.length === 0) {
				messageQueueRef.current = buildMessageQueue(
					totalMessages.length,
					lastMessageIndexRef.current,
				);
			}

			const nextIndex = messageQueueRef.current.shift();
			if (typeof nextIndex !== "number") return;

			lastMessageIndexRef.current = nextIndex;
			const randomMessage = totalMessages[nextIndex];

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
		// tierCounts/userTier가 바뀌면 메시지 풀 내용은 같아도 치환 결과가 달라질 수 있으니
		// 다음 사이클부터 새 셔플이 적용되도록 큐를 초기화합니다.
		messageQueueRef.current = [];
		showMessage();
		const interval = setInterval(showMessage, MESSAGE_CHANGE_INTERVAL);
		return () => clearInterval(interval);
	}, [tierCounts, userTier]);

	return (
		<div className="flex h-auto w-full max-w-[560px] animate-fade-in flex-col items-center justify-center gap-6 rounded-[24px] bg-gray-100 px-6 py-8 text-gray-800 transition-opacity duration-500 md:h-[560px] md:gap-[42px] md:rounded-[30px] md:p-[30px_80px]">
			{/* 하트 애니메이션 */}
			<div className="animate-grow-shrink">
				<HeartIcon className="h-[140px] w-[140px] text-violet-600 md:h-[225px] md:w-[225px]" />
			</div>
			{/* 랜덤 메세지 + 시간 */}
			<div className="flex flex-col items-center gap-2 md:gap-[4px]">
				{/* 랜덤 메세지 */}
				<div
					className={clsx(
						`md:regular-20 flex h-[48px] items-center justify-center text-center mobile:text-2xl text-sm transition-opacity duration-300 md:h-[60px]`,
						textVisible
							? "animate-fade-in opacity-100"
							: "animate-fade-out opacity-0",
					)}
				>
					{currentMessage}
				</div>
				{/* 시간 표시 */}
				<div className="md:light-32 mobile:text-2xl text-gray-700 text-lg">
					<span className="md:bold-32 font-bold text-violet-600">
						{formatTime(timeLeft)}&nbsp;
					</span>
					/ 5:00
				</div>
			</div>
		</div>
	);
}

export default MatchLoadingCard;
