import { useEffect, useState } from "react";
import type { GameStyleResponse } from "@/shared/api";
import { useSocketMessage, useSocketSend } from "@/shared/api/socket";
import { useAuthUser } from "@/shared/providers";
import type { UseMatchFunnelReturn } from "../../../hooks";
import type {
	MatchingCountData,
	MatchingFoundData,
	MatchingRequest,
	MatchingSuccessData,
} from "../../../lib/matching-types";
import MatchHeader from "../../match-header";
import MatchLoadingCard from "./match-loading-card";
import MatchStartProfile from "./match-start-profile";

const MAX_MATCHING_TIME = 300; // 5분
const TIMER_INTERVAL = 1000; // 1초

interface MatchStartStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchStartStep({ funnel }: MatchStartStepProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [timeLeft, setTimeLeft] = useState(MAX_MATCHING_TIME);
	const [tierCounts, setTierCounts] = useState<Record<string, number>>({});
	const [, setOpponent] = useState<MatchingFoundData["opponent"] | null>(null);

	const { send, isConnected } = useSocketSend();
	const { authUser } = useAuthUser();

	// ✅ 매칭 시작됨
	useSocketMessage("matching-started", (data) => {
		console.log("🟢 매칭 시작됨:", data);
		setIsLoading(true);
	});

	// ✅ 매칭 카운트 (matching-started 이후)
	useSocketMessage<MatchingCountData>("matching-count", (data) => {
		setTierCounts({
			...data.tierCount,
			total: data.userCount,
		});
	});

	// ✅ 매칭 상대 발견 (Sender)
	useSocketMessage<MatchingFoundData>("matching-found-sender", (data) => {
		console.log("🎯 matching-found-sender:", data);
		setOpponent(data.opponent || null);
		setIsLoading(false);

		if (data.opponent && data.senderMatchingUuid) {
			funnel.toStep("match-complete", {
				matchComplete: {
					role: "sender",
					opponent: data.opponent,
					matchingUuid: data.senderMatchingUuid,
				},
			});
		}
	});

	// ✅ 매칭 상대 발견 (Receiver)
	useSocketMessage<MatchingFoundData>("matching-found-receiver", (data) => {
		console.log("🎯 matching-found-receiver:", data);
		setOpponent(data.opponent || null);
		setIsLoading(false);

		if (data.opponent && data.senderMatchingUuid) {
			funnel.toStep("match-complete", {
				matchComplete: {
					role: "receiver",
					opponent: data.opponent,
					matchingUuid: data.senderMatchingUuid,
				},
			});
		}
	});

	// ✅ 매칭 성공 (Sender)
	useSocketMessage<MatchingSuccessData>("matching-success-sender", (data) => {
		console.log("✅ 매칭 성공 (Sender):", data);
		setTimeout(() => {
			send("matching-success-final");
		}, 3000);
	});

	// ✅ 매칭 성공 (Receiver)
	useSocketMessage<MatchingSuccessData>("matching-success-receiver", (data) => {
		console.log("✅ 매칭 성공 (Receiver):", data);
		setTimeout(() => {
			send("matching-success-final");
		}, 5000);
	});

	// ✅ 최종 매칭 성공
	useSocketMessage<MatchingSuccessData>("matching-success-final", (data) => {
		console.log("🎉 최종 매칭 성공:", data);
		// TODO: 채팅방 열기 로직
	});

	// ✅ 매칭 실패
	useSocketMessage("matching-fail", () => {
		console.warn("❌ 매칭 실패");
		// TODO: 매칭 실패 모달
	});

	// ✅ 에러 처리
	useSocketMessage("error", (errorData: { data: string }) => {
		console.error("소켓 에러:", errorData.data);
	});

	// ✅ 중복 방지 + 연결 완료 후 요청
	useEffect(() => {
		if (!isConnected) return;

		const user = authUser;
		if (!user) return;

		if (sessionStorage.getItem("matching-request-sent") === "true") return;

		const matchingRequest: MatchingRequest = {
			matchingType: funnel.context.type ?? "BASIC",
			gameMode: funnel.context.gameMode ?? "SOLO",
			threshold: 50,
			mike: user.mike ?? "UNAVAILABLE",
			mainP: user.mainP,
			subP: user.subP,
			wantP: user.wantP,
			gameStyleIdList: user.gameStyleResponseList?.map(
				(style: GameStyleResponse) => style.gameStyleId,
			),
		};

		send("matching-request", matchingRequest);
		sessionStorage.setItem("matching-request-sent", "true");
	}, [isConnected, send, funnel.context]);

	// ✅ 5분 타이머 (30초마다 재시도)
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				const newTime = prev - 1;

				// 30초마다 threshold 완화
				if (newTime % 30 === 0 && newTime > 0) {
					const newThreshold = Math.min(
						100,
						50 + Math.floor((MAX_MATCHING_TIME - newTime) / 30) * 5,
					);
					console.log("🔁 매칭 재시도 (threshold:", newThreshold, ")");
					send("matching-retry", { threshold: newThreshold });
				}

				if (newTime <= 0) {
					send("matching-fail");
					clearInterval(timer);
				}

				return newTime;
			});
		}, TIMER_INTERVAL);

		return () => clearInterval(timer);
	}, [send]);

	return (
		<>
			<MatchHeader
				step="match-start"
				title="매칭 중"
				subtitle="나와 꼭 맞는 상대를 찾는 중..."
				onBack={() => funnel.toStep("profile")}
			/>
			<div className="flex justify-center p-10 items-center h-fit gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
				<MatchStartProfile />
				{isLoading ? (
					<MatchLoadingCard
						timeLeft={timeLeft}
						tierCounts={tierCounts}
						userTier="UNRANKED"
					/>
				) : (
					<MatchStartProfile opponent />
				)}
			</div>
		</>
	);
}

export default MatchStartStep;
