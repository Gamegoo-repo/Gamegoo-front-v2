import { useEffect, useRef, useState } from "react";
import { socketManager } from "@/shared/api/socket";
import {
	getAuthUserId,
	makeMatchingRequestKeyFromId,
} from "@/shared/lib/auth-user";
import { useAuthUser } from "@/shared/providers";
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
	const { authUser } = useAuthUser();
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const thresholdRef = useRef(51.5);
	const didSendMatchingRequestRef = useRef(false);
	const didSendFoundSuccessRef = useRef(false);
	const user = funnel.context.profile;

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
					console.log(
						"⏰ [V2-Progress] 매칭 시간 초과 - matching-not-found 전송",
					);
					socketManager.send("matching-not-found");
					console.log("✅ [V2-Progress] matching-not-found 전송 완료");
					handleRetry(); // 매칭 실패 모달 결정 함수
				} else if (prevTime < 300 && prevTime % 30 === 0) {
					// 30초마다 threshold 값을 감소시키며 매칭 재시도
					thresholdRef.current -= 1.5;
					console.log(
						`🔁 [V2-Progress] matching-retry 전송 (threshold: ${thresholdRef.current})`,
					);
					socketManager.send("matching-retry", {
						threshold: thresholdRef.current,
					});
					console.log(`✅ [V2-Progress] matching-retry 전송 완료`);
				}
				return prevTime - 1;
			});
		}, TIMER_INTERVAL);
	};

	useEffect(
		() => {
			console.log("🔍 [V2-Debug] useEffect 실행:", {
				socketConnected: socketManager.connected,
				socketInstance: !!socketManager.socketInstance,
				socketSocket: !!socketManager.socketInstance?.socket,
				funnelContext: funnel.context,
			});

			if (!socketManager.connected) {
				console.error("❌ [V2-Debug] Socket is not connected.");
				return;
			}

			const handleMatchingStarted = (data: any) => {
				console.log("🟢 [V2-Progress] matching-started 수신:", data);
			};

			const handleMatchingCount = (data: any) => {
				console.log("📊 [V2-Progress] matching-count 수신:", data);
				console.log("📊 [V2-Progress] 이전 tierCounts:", tierCounts);
				const newTierCounts = {
					...data.data.tierCount,
					total: data.data.userCount,
				};
				console.log("📊 [V2-Progress] 새로운 tierCounts:", newTierCounts);
				setTierCounts(newTierCounts);
			};

			const handleMatchingFoundSender = (data: any) => {
				console.log("🎯 [V2-Progress] matching-found-sender 수신:", data);
				clearTimers();
				console.log("🚀 [V2-Progress] Complete 페이지로 이동 (sender)");
				const opponentData = data?.data ?? {};
				const matchingUuid =
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
				console.log("🎯 [V2-Progress] matching-found-receiver 수신:", data);
				clearTimers();
				console.log("🚀 [V2-Progress] matching-found-success 전송:", {
					senderMatchingUuid: data.data.senderMatchingInfo.matchingUuid,
				});
				if (!didSendFoundSuccessRef.current) {
					didSendFoundSuccessRef.current = true;
					socketManager.send("matching-found-success", {
						senderMatchingUuid: data.data.senderMatchingInfo.matchingUuid,
					});
				} else {
					console.warn("⚠️ [V2-Progress] 중복 matching-found-success 차단");
				}
				console.log("🚀 [V2-Progress] Complete 페이지로 이동 (receiver)");
				funnel.toStep("match-complete", {
					matchComplete: {
						role: "receiver",
						opponent: data.data.senderMatchingInfo,
						matchingUuid: data.data.senderMatchingInfo.matchingUuid,
					},
				});
			};

			// 모든 소켓 이벤트 로깅 (디버그용)
			const _handleAllEvents = (eventName: string) => {
				return (...args: any[]) => {
					console.log(`🔊 [V2-Debug] 소켓 이벤트 수신: ${eventName}`, args);
				};
			};

			// 기존 리스너 제거
			socketManager.off("matching-started", handleMatchingStarted);
			socketManager.off("matching-count", handleMatchingCount);
			socketManager.off("matching-found-sender", handleMatchingFoundSender);
			socketManager.off("matching-found-receiver", handleMatchingFoundReceiver);

			// 새 리스너 등록 (두 가지 방식 모두 시도)
			socketManager.on("matching-started", handleMatchingStarted);
			socketManager.on("matching-count", handleMatchingCount);
			socketManager.on("matching-found-sender", handleMatchingFoundSender);
			socketManager.on("matching-found-receiver", handleMatchingFoundReceiver);

			// 직접 소켓에도 등록 (백업)
			if (socketManager.socketInstance?.socket) {
				const socket = socketManager.socketInstance.socket;
				socket.on("matching-started", handleMatchingStarted);
				socket.on("matching-count", handleMatchingCount);
				socket.on("matching-found-sender", handleMatchingFoundSender);
				socket.on("matching-found-receiver", handleMatchingFoundReceiver);

				// 모든 이벤트 로깅
				socket.onAny((eventName, ...args) => {
					console.log(`🔊 [V2-Debug] Raw 소켓 이벤트: ${eventName}`, args);
					// 에러 이벤트 상세 로깅
					if (eventName === "error") {
						console.error(`❌ [V2-Debug] 소켓 에러 상세:`, args[0]);
					}
				});
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
				mike: profile.mike ?? user?.mike ?? "UNAVAILABLE",
				mainP: profile.mainP ?? user?.mainP ?? "ANY",
				subP: profile.subP ?? user?.subP ?? "ANY",
				wantP:
					funnel.context.type === "PRECISE"
						? profile.wantP?.map((p) => p ?? "ANY")
						: ["ANY"],
				gameStyleIdList: (() => {
					const ids =
						profile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
						user?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
						[];
					return ids.length > 0 ? ids : null;
				})(),
			};

			// memberId 기반 중복 전송 방지 (id가 유효할 때만 적용)
			const userId = getAuthUserId(authUser);
			const hasValidId = typeof userId === "number";
			const requestDedupKey = hasValidId
				? makeMatchingRequestKeyFromId(userId as number)
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
				console.log("🚀 [V2-Progress] matching-request 전송:", matchingData);
				socketManager.send("matching-request", matchingData);
				console.log("✅ [V2-Progress] matching-request 전송 완료");
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

				// 직접 소켓에서도 제거
				if (socketManager.socketInstance?.socket) {
					const socket = socketManager.socketInstance.socket;
					socket.off("matching-started", handleMatchingStarted);
					socket.off("matching-count", handleMatchingCount);
					socket.off("matching-found-sender", handleMatchingFoundSender);
					socket.off("matching-found-receiver", handleMatchingFoundReceiver);
					socket.offAny();
				}

				clearTimers();
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[socketManager.connected],
	);

	const handleRetry = async () => {};

	const handleBack = () => {
		// 매칭 취소 이벤트 전송
		console.log("🚪 [V2-Progress] 뒤로가기 - matching-quit 전송");
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
	};

	return (
		<>
			<MatchHeader
				title="매칭 중"
				subtitle="나와 꼭 맞는 상대를 찾는 중..."
				onBack={handleBack}
			/>
			<div className="flex justify-center p-10 items-center h-fit gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
				<MatchStartProfile user={authUser} />
				<MatchLoadingCard
					timeLeft={timeLeft}
					tierCounts={tierCounts}
					userTier={authUser?.soloTier ?? "UNRANKED"}
				/>
			</div>
		</>
	);
}

export default MatchStartStep;
