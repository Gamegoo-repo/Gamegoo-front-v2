import { useEffect, useRef, useState } from "react";
import { socketManager } from "@/shared/api/socket";
import { getAuthUserId } from "@/shared/lib/auth-user";
import { toast } from "@/shared/lib/toast";
import type { UseMatchFunnelReturn } from "@/widgets/match/hooks";
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
	const [_isLoading, _setIsLoading] = useState(true);
	const [timeLeft, setTimeLeft] = useState(MAX_MATCHING_TIME);
	const [tierCounts, setTierCounts] = useState<Record<string, number>>({});
	const [, _setOpponent] = useState<null>(null);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const thresholdRef = useRef(51.5);
	const didSendMatchingRequestRef = useRef(false);
	const didSendFoundSuccessRef = useRef(false);
	const shouldResendRequestRef = useRef(false);
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
		thresholdRef.current = GAME_MODE_THRESHOLD[funnel.gameMode ?? "FAST"]; // 초기 threshold 값

		timerRef.current = setInterval(() => {
			setTimeLeft((prevTime) => {
				if (prevTime === 1) {
					// 5분 타이머가 끝나면 매칭 실패 처리
					clearTimers(); // 타이머 정리
					socketManager.send("matching-not-found");
					handleRetry(); // 매칭 실패 모달 결정 함수
				} else if (prevTime < 300 && prevTime % 30 === 0) {
					// 30초마다 threshold 값을 감소시키며 매칭 재시도
					thresholdRef.current -= 1.5;
					socketManager.send("matching-retry", {
						threshold: thresholdRef.current,
					});
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
				if (!didSendFoundSuccessRef.current) {
					didSendFoundSuccessRef.current = true;
					socketManager.send("matching-found-success", {
						senderMatchingUuid: ev.data.senderMatchingInfo.matchingUuid,
					});
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

			// 기존 리스너 제거
			socketManager.off("matching-started", handleMatchingStarted);
			socketManager.off("matching-count", handleMatchingCount);
			socketManager.off("matching-found-sender", handleMatchingFoundSender);
			socketManager.off("matching-found-receiver", handleMatchingFoundReceiver);
			socketManager.off("matching-not-found", handleMatchingNotFound);
			socketManager.off("matching-fail", handleMatchingFail);
			socketManager.off("jwt-expired-error", handleJwtExpired);
			socketManager.off("connect", handleReconnectSend);

			// 새 리스너 등록 (두 가지 방식 모두 시도)
			socketManager.on("matching-started", handleMatchingStarted);
			socketManager.on("matching-count", handleMatchingCount);
			socketManager.on("matching-found-sender", handleMatchingFoundSender);
			socketManager.on("matching-found-receiver", handleMatchingFoundReceiver);
			socketManager.on("matching-not-found", handleMatchingNotFound);
			socketManager.on("matching-fail", handleMatchingFail);
			socketManager.on("jwt-expired-error", handleJwtExpired);
			socketManager.on("connect", handleReconnectSend);

			// 직접 소켓에도 등록 (백업)
			if (socketManager.socketInstance?.socket) {
				const socket = socketManager.socketInstance.socket;
				socket.on("matching-started", handleMatchingStarted);
				socket.on("matching-count", handleMatchingCount);
				socket.on("matching-found-sender", handleMatchingFoundSender);
				socket.on("matching-found-receiver", handleMatchingFoundReceiver);
				socket.on("matching-not-found", handleMatchingNotFound);
				socket.on("matching-fail", handleMatchingFail);
				socket.on("jwt-expired-error", handleJwtExpired);
				socket.on("connect", handleReconnectSend);
			}

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
				matchingType: funnel.type,
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

			// 중복 전송 방지
			const shouldBlock = didSendMatchingRequestRef.current;

			if (!shouldBlock) {
				didSendMatchingRequestRef.current = true;
				socketManager.send("matching-request", matchingData);
			}

			// 5분 타이머
			startMatchingProcess();

			return () => {
				socketManager.off("matching-started", handleMatchingStarted);
				socketManager.off("matching-count", handleMatchingCount);
				socketManager.off("matching-found-sender", handleMatchingFoundSender);
				socketManager.off(
					"matching-found-receiver",
					handleMatchingFoundReceiver,
				);
				socketManager.off("jwt-expired-error", handleJwtExpired);
				socketManager.off("connect", handleReconnectSend);
				socketManager.off("matching-not-found", handleMatchingNotFound);
				socketManager.off("matching-fail", handleMatchingFail);

				// 직접 소켓에서도 제거
				if (socketManager.socketInstance?.socket) {
					const socket = socketManager.socketInstance.socket;
					socket.off("matching-started", handleMatchingStarted);
					socket.off("matching-count", handleMatchingCount);
					socket.off("matching-found-sender", handleMatchingFoundSender);
					socket.off("matching-found-receiver", handleMatchingFoundReceiver);
					socket.off("matching-not-found", handleMatchingNotFound);
					socket.off("matching-fail", handleMatchingFail);
					socket.off("jwt-expired-error", handleJwtExpired);
					socket.off("connect", handleReconnectSend);
				}

				clearTimers();
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[socketManager.connected],
	);

	// JWT 만료 처리: dedup 해제 및 재전송 플래그 설정
	const handleJwtExpired = () => {
		shouldResendRequestRef.current = true;
		didSendMatchingRequestRef.current = false;
	};

	// 재연결 시 재요청 처리
	const handleReconnectSend = () => {
		const gameMode = funnel.gameMode;
		const profile = funnel.profile || {};
		if (!gameMode) return;
		const defaultThreshold = GAME_MODE_THRESHOLD[gameMode];
		// 최초 전송이면 기본 threshold 사용 + ref 동기화
		const isFirstSend = !didSendMatchingRequestRef.current;
		if (isFirstSend) {
			thresholdRef.current = defaultThreshold;
		}
		const matchingData = {
			matchingType: funnel.type,
			gameMode: gameMode,
			memberId: getAuthUserId(authUser) ?? undefined,
			threshold: isFirstSend
				? defaultThreshold
				: thresholdRef.current || defaultThreshold,
			mike: profile.mike ?? "UNAVAILABLE",
			mainP: profile.mainP ?? "ANY",
			subP: profile.subP ?? "ANY",
			wantP:
				funnel.type === "PRECISE" ? mapPreciseWantPositions(profile.wantP) : [],
			gameStyleIdList: (() => {
				const ids =
					profile.gameStyleResponseList?.map((s) => s.gameStyleId) ?? [];
				return ids.length > 0 ? ids : null;
			})(),
		};
		// 연결 직후: 아직 요청을 보낸 적이 없다면 최초 요청 전송
		if (!didSendMatchingRequestRef.current) {
			didSendMatchingRequestRef.current = true;
			socketManager.send("matching-request", matchingData);
			return;
		}
		// JWT 만료 등으로 재전송 플래그가 켜진 경우에만 재전송
		if (shouldResendRequestRef.current) {
			shouldResendRequestRef.current = false;
			socketManager.send("matching-request", matchingData);
		}
	};

	const handleRetry = async () => {
		// 간단한 재시도 UX: 프로필 단계로 이동
		funnel.toStep("profile");
	};

	const handleBack = () => {
		// 매칭 취소 이벤트 전송
		socketManager.send("matching-quit");
		// 타이머 정리
		clearTimers();
		// 중복 전송 가드 초기화
		didSendMatchingRequestRef.current = false;
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
