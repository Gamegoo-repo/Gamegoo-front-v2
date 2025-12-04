import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { socketManager } from "@/shared/api/socket";
import {
	getAuthUserId,
	makeMatchingRequestKeyFromId,
} from "@/shared/lib/auth-user";
import type { UseMatchFunnelReturn } from "@/widgets/match/hooks";
import type { MatchingFoundData } from "@/widgets/match/lib/matching-types";
import MatchHeader from "../../match-header";
import MatchLoadingCard from "./match-loading-card";
import MatchStartProfile from "./match-start-profile";

const MAX_MATCHING_TIME = 300; // 5분
const TIMER_INTERVAL = 1000; // 1초

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
	const [, _setOpponent] = useState<MatchingFoundData["opponent"] | null>(null);

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const thresholdRef = useRef(51.5);
	const didSendMatchingRequestRef = useRef(false);
	const didSendFoundSuccessRef = useRef(false);
	const shouldResendRequestRef = useRef(false);
	const authUser = funnel.user;

	const clearTimers = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const startMatchingProcess = async () => {
		if (timerRef.current) return; // 이미 타이머가 실행 중이면 추가로 설정하지 않음

		// 매칭 재시도 여부에 따라 타이머 설정
		thresholdRef.current =
			GAME_MODE_THRESHOLD[funnel.context.gameMode ?? "FAST"] + 1.5; // 초기 threshold 값

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
			if (!socketManager.connected) {
				console.error("❌ [V2-Debug] Socket is not connected.");
				return;
			}

			const handleMatchingStarted = (_data: any) => {};

			const handleMatchingCount = (data: any) => {
				const newTierCounts = {
					...data.data.tierCount,
					total: data.data.userCount,
				};
				setTierCounts(newTierCounts);
			};

			const handleMatchingFoundSender = (data: any) => {
				clearTimers();
				const opponentData =
					data?.data?.opponent ?? data?.opponent ?? data?.data ?? {};
				// sender 쪽에서 서버가 내려주는 다양한 필드 대응
				const matchingUuid =
					data?.data?.senderMatchingUuid ??
					data?.senderMatchingUuid ??
					data?.data?.senderMatchingInfo?.matchingUuid ??
					data?.data?.matchingUuid ??
					"";
				funnel.toStep("match-complete", {
					matchComplete: {
						role: "sender",
						opponent: opponentData,
						matchingUuid,
					},
				});
			};

			const handleMatchingFoundReceiver = (data: any) => {
				clearTimers();
				if (!didSendFoundSuccessRef.current) {
					didSendFoundSuccessRef.current = true;
					socketManager.send("matching-found-success", {
						senderMatchingUuid: data.data.senderMatchingInfo.matchingUuid,
					});
				} else {
					console.warn("⚠️ [V2-Progress] 중복 matching-found-success 차단");
				}
				funnel.toStep("match-complete", {
					matchComplete: {
						role: "receiver",
						opponent: data.data.senderMatchingInfo,
						matchingUuid: data.data.senderMatchingInfo.matchingUuid,
					},
				});
			};

			// 기존 리스너 제거
			socketManager.off("matching-started", handleMatchingStarted);
			socketManager.off("matching-count", handleMatchingCount);
			socketManager.off("matching-found-sender", handleMatchingFoundSender);
			socketManager.off("matching-found-receiver", handleMatchingFoundReceiver);
			socketManager.off("jwt-expired-error", handleJwtExpired);
			socketManager.off("connect", handleReconnectSend);

			// 새 리스너 등록 (두 가지 방식 모두 시도)
			socketManager.on("matching-started", handleMatchingStarted);
			socketManager.on("matching-count", handleMatchingCount);
			socketManager.on("matching-found-sender", handleMatchingFoundSender);
			socketManager.on("matching-found-receiver", handleMatchingFoundReceiver);
			socketManager.on("jwt-expired-error", handleJwtExpired);
			socketManager.on("connect", handleReconnectSend);

			// 직접 소켓에도 등록 (백업)
			if (socketManager.socketInstance?.socket) {
				const socket = socketManager.socketInstance.socket;
				socket.on("matching-started", handleMatchingStarted);
				socket.on("matching-count", handleMatchingCount);
				socket.on("matching-found-sender", handleMatchingFoundSender);
				socket.on("matching-found-receiver", handleMatchingFoundReceiver);
				socket.on("jwt-expired-error", handleJwtExpired);
				socket.on("connect", handleReconnectSend);
			}

			// gameMode 검증
			const gameMode = funnel.context.gameMode;
			if (!gameMode) {
				console.error(
					"❌ [V2-Debug] gameMode가 설정되지 않았습니다:",
					funnel.context,
				);
				return;
			}

			const profile = funnel.context.profile || {};
			const matchingData = {
				matchingType: funnel.context.type,
				gameMode: gameMode,
				threshold: GAME_MODE_THRESHOLD[gameMode] || GAME_MODE_THRESHOLD.FAST,
				mike: profile.mike ?? authUser?.mike ?? "UNAVAILABLE",
				mainP: profile.mainP ?? authUser?.mainP ?? "ANY",
				subP: profile.subP ?? authUser?.subP ?? "ANY",
				wantP:
					funnel.context.type === "PRECISE"
						? profile.wantP?.map((p) => p ?? "ANY")
						: ["ANY"],
				gameStyleIdList: (() => {
					const ids =
						profile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
						authUser?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
						[];
					return ids.length > 0 ? ids : null;
				})(),
			};

			// memberId 기반 중복 전송 방지 (id가 유효할 때만 적용)
			const userId = getAuthUserId(authUser);
			const hasValidId = typeof userId === "number";
			const requestDedupKey = hasValidId
				? makeMatchingRequestKeyFromId(userId)
				: null;

			const shouldBlock =
				didSendMatchingRequestRef.current ||
				(requestDedupKey
					? sessionStorage.getItem(requestDedupKey) === "true"
					: false);

			if (!shouldBlock) {
				didSendMatchingRequestRef.current = true;
				if (requestDedupKey) {
					sessionStorage.setItem(requestDedupKey, "true");
				} else {
					// id가 아직 로드 전이라면 dedup을 스킵하고 전송
					console.warn("⚠️ [V2-Progress] 유효하지 않은 userId로 dedup 스킵");
				}
				socketManager.send("matching-request", matchingData);
			} else {
				console.warn("⚠️ [V2-Progress] 중복 matching-request 차단", {
					userId,
				});
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

				// 직접 소켓에서도 제거
				if (socketManager.socketInstance?.socket) {
					const socket = socketManager.socketInstance.socket;
					socket.off("matching-started", handleMatchingStarted);
					socket.off("matching-count", handleMatchingCount);
					socket.off("matching-found-sender", handleMatchingFoundSender);
					socket.off("matching-found-receiver", handleMatchingFoundReceiver);
					socket.off("jwt-expired-error", handleJwtExpired as any);
					socket.off("connect", handleReconnectSend as any);
					socket.offAny();
				}

				clearTimers();
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[socketManager.connected],
	);

	// JWT 만료 처리: dedup 해제 및 재전송 플래그 설정
	const handleJwtExpired = () => {
		const userId = getAuthUserId(authUser as any);
		if (typeof userId === "number") {
			sessionStorage.removeItem(`matching-request-sent:${userId}`);
		}
		shouldResendRequestRef.current = true;
		didSendMatchingRequestRef.current = false;
	};

	// 재연결 시 재요청 처리
	const handleReconnectSend = () => {
		if (!shouldResendRequestRef.current) return;
		shouldResendRequestRef.current = false;
		const gameMode = funnel.context.gameMode;
		const profile = funnel.context.profile || {};
		if (!gameMode) return;
		const matchingData = {
			matchingType: funnel.context.type,
			gameMode: gameMode,
			threshold: GAME_MODE_THRESHOLD[gameMode] || GAME_MODE_THRESHOLD.FAST,
			mike: profile.mike ?? authUser?.mike ?? "UNAVAILABLE",
			mainP: profile.mainP ?? authUser?.mainP ?? "ANY",
			subP: profile.subP ?? authUser?.subP ?? "ANY",
			wantP:
				funnel.context.type === "PRECISE"
					? profile.wantP?.map((p) => p ?? "ANY")
					: ["ANY"],
			gameStyleIdList: (() => {
				const ids =
					profile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
					authUser?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
					[];
				return ids.length > 0 ? ids : null;
			})(),
		};
		socketManager.send("matching-request", matchingData);
	};

	const handleRetry = async () => {};

	const handleBack = () => {
		// 매칭 취소 이벤트 전송
		socketManager.send("matching-quit");
		// 타이머 정리
		clearTimers();
		// 중복 전송 가드 초기화
		didSendMatchingRequestRef.current = false;
		didSendFoundSuccessRef.current = false;
		// 세션 스토리지 dedup 키 제거
		const userId = getAuthUserId(authUser);
		if (typeof userId === "number") {
			sessionStorage.removeItem(makeMatchingRequestKeyFromId(userId));
		}
		// 혹시 'unknown'으로 저장된 키가 있다면 제거
		sessionStorage.removeItem("matching-request-sent:unknown");
		// 프로필 단계로 이동
		funnel.toStep("profile");
		// 토스트 노출
		toast.error("화면 이탈로 매칭이 종료되었습니다.");
	};

	return (
		<>
			<MatchHeader
				title="매칭 중"
				subtitle="나와 꼭 맞는 상대를 찾는 중..."
				onBack={handleBack}
			/>
			<div className="w-full flex justify-center items-center pt-[110px] mobile:pt-0">
				<div className="max-w-[1440px] w-full px-[80px] pt-[60px] mobile:px-[20px] mobile:pt-[24px]">
					<div className="flex justify-center items-center w-full gap-[59px] mt-[72px] mb-[150px] max-[1300px]:flex-col max-[1300px]:gap-[40px] mobile:mt-[15px]">
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
