import { useEffect, useRef, useState } from "react";
import { getAuthUserId } from "@/shared/lib/auth-user";
import { toast } from "@/shared/lib/toast";
import type { UseMatchFunnelReturn } from "@/widgets/match/hooks";
import { matchFlow } from "@/widgets/match/lib/match-flow";
import type {
	MatchingCountData,
	MatchingFoundReceiverEvent,
	MatchingFoundSenderEvent,
} from "@/widgets/match/lib/matching-types";
import MatchHeader from "../../match-header";
import MatchLoadingCard from "./match-loading-card";
import MatchStartProfile from "./match-start-profile";

const MAX_MATCHING_TIME = 300; // 5분
const TIMER_INTERVAL = 1000; // 1초
const mapPreciseWantPositions = (wantP?: string[] | null) => {
	const normalized = (wantP || []).filter((p): p is string => !!p);
	if (normalized.length === 0) return ["ANY", "ANY"];
	if (normalized.length === 1) {
		const first = normalized[0];
		return first === "ANY" ? ["ANY", "ANY"] : [first, "ANY"];
	}
	return [normalized[0], normalized[1]];
};

interface MatchStartStepProps {
	funnel: UseMatchFunnelReturn;
}

const GAME_MODE_THRESHOLD: Record<string, number> = {
	FAST: 25, // 빠른 대전
	SOLO: 67, // 개인 랭크
	FREE: 65, // 자유 랭크
	ARAM: 19, // 칼바람
};

function MatchStartStep({ funnel }: MatchStartStepProps) {
	const [timeLeft, setTimeLeft] = useState(MAX_MATCHING_TIME);
	const [tierCounts, setTierCounts] = useState<Record<string, number>>({});

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const didSendFoundSuccessRef = useRef(false);
	const isFirstCleanupRef = useRef(true);
	const sessionIdRef = useRef(0);
	const authUser = funnel.user;

	// MatchCompleteState 제거: 강한 타입으로 직접 주입

	const clearTimers = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const startMatchingProcess = async () => {
		if (timerRef.current) return; // 이미 타이머가 실행 중이면 추가로 설정하지 않음

		// 매칭 재시도 여부에 따라 타이머 설정
		// 초기 threshold는 start 호출 시 설정됨

		timerRef.current = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime === 1) {
					// 5분 타이머가 끝나면 매칭 실패 처리
					clearTimers(); // 타이머 정리
					matchFlow.markNotFound();
					handleRetry(); // 매칭 실패 모달 결정 함수
				} else if (prevTime < 300 && prevTime % 30 === 0) {
					// 30초마다 threshold 값을 감소시키며 매칭 재시도
					matchFlow.retryTick(1.5);
				}
				return prevTime - 1;
			});
		}, TIMER_INTERVAL);
	};

	useEffect(
		() => {
			const handleMatchingStarted = (_data: unknown) => {
				setTierCounts({});
			};

			const handleMatchingCount = (data: unknown) => {
				const d = data as MatchingCountData;
				const newTierCounts = {
					...d.data.tierCount,
					total: d.data.userCount,
				};
				setTierCounts(newTierCounts);
			};

			const handleMatchingFoundSender = (data: unknown) => {
				const ev = data as MatchingFoundSenderEvent;
				clearTimers();
				const opponentData = ev.data;
				const matchingUuid = ev.data.matchingUuid;
				matchFlow.beginCompletePhase();
				funnel.toStep("match-complete", {
					matchComplete: {
						role: "sender",
						opponent: opponentData,
						matchingUuid,
					},
				});
			};

			const handleMatchingFoundReceiver = (data: unknown) => {
				const ev = data as MatchingFoundReceiverEvent;
				clearTimers();
				matchFlow.beginCompletePhase();
				if (!didSendFoundSuccessRef.current) {
					didSendFoundSuccessRef.current = true;
					matchFlow.confirmFoundReceiver(
						ev.data.senderMatchingInfo.matchingUuid,
					);
				}
				funnel.toStep("match-complete", {
					matchComplete: {
						role: "receiver",
						opponent: ev.data.senderMatchingInfo,
						matchingUuid: ev.data.senderMatchingInfo.matchingUuid,
					},
				});
			};

			const handleMatchingNotFound = () => {
				clearTimers();
				handleRetry();
			};

			const handleMatchingFail = () => {
				clearTimers();
				toast.error("매칭에 실패했어요. 다시 시도해 주세요.");
				funnel.toStep("profile");
			};

			// 이벤트 구독 (matchFlow 관리)
			matchFlow.on("matching-started", handleMatchingStarted);
			matchFlow.on("matching-count", handleMatchingCount);
			matchFlow.on("matching-found-sender", handleMatchingFoundSender);
			matchFlow.on("matching-found-receiver", handleMatchingFoundReceiver);
			matchFlow.on("matching-not-found", handleMatchingNotFound);
			matchFlow.on("matching-fail", handleMatchingFail);

			// gameMode 검증
			const gameMode = funnel.gameMode;
			if (!gameMode) {
				console.error("❌ [V2-Debug] gameMode가 설정되지 않았습니다:", {
					type: funnel.type,
					gameMode: funnel.gameMode,
					profile: funnel.profile,
				});
				return;
			}

			const profile = funnel.profile || {};
			const matchingData = {
				matchingType: funnel.type ?? "BASIC",
				gameMode: gameMode,
				memberId: getAuthUserId(authUser) ?? undefined,
				threshold: GAME_MODE_THRESHOLD[gameMode],
				mike: profile.mike ?? authUser?.mike ?? "UNAVAILABLE",
				mainP: profile.mainP ?? authUser?.mainP ?? "ANY",
				subP: profile.subP ?? authUser?.subP ?? "ANY",
				wantP:
					funnel.type === "PRECISE"
						? mapPreciseWantPositions(profile.wantP)
						: [],
				gameStyleIdList: (() => {
					const ids =
						profile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
						authUser?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
						[];
					return ids.length > 0 ? ids : null;
				})(),
			};

			// 매칭 시작 (중복 전송 방지 내부 처리)
			matchFlow.start(matchingData);
			sessionIdRef.current = matchFlow.getSessionId();

			// 5분 타이머
			startMatchingProcess();

			return () => {
				matchFlow.off("matching-started", handleMatchingStarted);
				matchFlow.off("matching-count", handleMatchingCount);
				matchFlow.off("matching-found-sender", handleMatchingFoundSender);
				matchFlow.off("matching-found-receiver", handleMatchingFoundReceiver);
				matchFlow.off("matching-not-found", handleMatchingNotFound);
				matchFlow.off("matching-fail", handleMatchingFail);

				// React 18 StrictMode의 첫 cleanup에서는 cancel을 건너뛰어
				// 요청 직후 quit가 나가는 현상을 방지
				if (isFirstCleanupRef.current) {
					isFirstCleanupRef.current = false;
				} else {
					// cancel은 내부에서 phase를 확인하여 필요 시에만 quit 전송
					matchFlow.cancel(sessionIdRef.current);
					// 페이지 이탈 시 단계도 프로필로 강제 이동
					funnel.toStep("profile");
				}

				clearTimers();
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const handleRetry = async () => {
		// 간단한 재시도 UX: 프로필 단계로 이동
		funnel.toStep("profile");
	};

	const handleBack = () => {
		// 매칭 취소 이벤트 전송
		matchFlow.cancel(sessionIdRef.current);
		// 타이머 정리
		clearTimers();
		// 중복 전송 가드 초기화
		didSendFoundSuccessRef.current = false;
		// 프로필 단계로 이동
		funnel.toStep("profile");
		toast.error("화면 이탈로 매칭이 종료되었습니다.");
	};

	return (
		<>
			<MatchHeader
				title="매칭 중"
				subtitle="나와 꼭 맞는 상대를 찾는 중..."
				onBack={handleBack}
			/>
			<div className="flex w-full items-center justify-center mobile:pt-0 pt-[110px]">
				<div className="w-full max-w-[1440px] mobile:px-[20px] px-[80px] mobile:pt-[24px] pt-[60px]">
					<div className="mobile:mt-[15px] mt-[72px] mb-[150px] flex w-full items-center justify-center gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
						<MatchStartProfile user={authUser} />
						<MatchLoadingCard
							timeLeft={timeLeft}
							tierCounts={tierCounts}
							userTier={authUser?.soloTier ?? "UNRANKED"}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default MatchStartStep;
