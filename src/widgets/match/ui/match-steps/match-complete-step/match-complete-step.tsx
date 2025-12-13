import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useChatDialogStore } from "@/entities/chat";
import { socketManager } from "@/shared/api/socket";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../../hooks";
import type { OpponentProfilePayload } from "../../../lib/matching-types";
import MatchHeader from "../../match-header";
import MatchStartProfile from "../match-start-step/match-start-profile";

const MATCHING_COMPLETE_TIME = 10; // 10초

interface MatchCompleteStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchCompleteStep({ funnel }: MatchCompleteStepProps) {
	const [timeLeft, setTimeLeft] = useState(MATCHING_COMPLETE_TIME);
	const authUser = funnel.user;
	const matchComplete = funnel.matchComplete;
	const role = matchComplete?.role;
	const matchingUuid = matchComplete?.matchingUuid;
	const mainTimerRef = useRef<NodeJS.Timeout | null>(null);
	const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null);
	const finalTimerRef = useRef<NodeJS.Timeout | null>(null);
	const didSendSuccessReceiverRef = useRef(false);
	const didSendSuccessFinalRef = useRef(false);

	// 공통 클린업
	const clearAllTimers = () => {
		if (mainTimerRef.current) clearInterval(mainTimerRef.current);
		if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
		if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
	};

	// 매칭 취소 핸들러
	const handleCancel = () => {
		// 매칭 취소 이벤트 전송
		if (socketManager.connected) {
			socketManager.send("matching-quit");
		}

		// 모든 타이머 정리
		clearAllTimers();

		// 프로필 단계로 이동
		funnel.toStep("profile");
		toast.error("화면 이탈로 매칭이 종료되었습니다.");
	};

	useEffect(() => {
		// 10초 카운트다운
		mainTimerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					if (mainTimerRef.current) {
						clearInterval(mainTimerRef.current);
						mainTimerRef.current = null;
					}
					// Receiver: 타임아웃 시 성공 응답 전송
					if (role === "receiver" && matchingUuid) {
						if (!didSendSuccessReceiverRef.current) {
							didSendSuccessReceiverRef.current = true;
							socketManager.send("matching-success-receiver", {
								senderMatchingUuid: matchingUuid,
							});
						} else {
							console.warn(
								"⚠️ [V2-Complete] 중복 matching-success-receiver 차단",
							);
						}
						// 5초 대기 후 실패 처리
						secondaryTimerRef.current = setTimeout(() => {
							socketManager.send("matching-fail");
						}, 5000);
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Sender: 서버에서 성공 알림 수신 시 최종 성공 전송 후 3초 타이머
		const handleMatchingSuccessSender = () => {
			if (!didSendSuccessFinalRef.current) {
				didSendSuccessFinalRef.current = true;
				socketManager.send("matching-success-final");
			} else {
				console.warn("⚠️ [V2-Complete] 중복 matching-success-final 차단");
			}
			finalTimerRef.current = setTimeout(() => {
				socketManager.send("matching-fail");
			}, 3000);
		};

		const handleMatchingSuccess = (_res: unknown) => {
			clearAllTimers();
			try {
				const payload = _res as {
					data?: {
						chatroomUuid?: string;
						opponent?: {
							gameName?: string;
						};
					};
					chatroomUuid?: string;
					opponent?: {
						gameName?: string;
					};
				};
				const chatroomUuid: string | null =
					payload?.data?.chatroomUuid ?? payload?.chatroomUuid ?? null;

				if (!chatroomUuid) {
					console.warn(
						"⚠️ matching-success 수신했지만 chatroomUuid 없음:",
						_res,
					);
					return;
				}

				const opponent =
					payload?.data?.opponent ??
					payload?.opponent ??
					matchComplete?.opponent;

				const { openDialog, setChatDialogType, setChatroom } =
					useChatDialogStore.getState();

				setChatroom({
					chatroomId: 0,
					uuid: chatroomUuid,
					targetMemberId: 0,
					targetMemberImg: 0,
					targetMemberName:
						(opponent?.gameName as string | undefined) || "상대",
					friend: false,
					blocked: false,
					blind: false,
					notReadMsgCnt: 0,
				});
				setChatDialogType("chatroom");
				openDialog();
			} catch (e) {
				console.error("채팅 전환 처리 중 오류:", e);
			}
		};

		const handleMatchingFail = () => {
			clearAllTimers();
			funnel.toStep("profile");
		};

		if (role === "sender") {
			socketManager.on("matching-success-sender", handleMatchingSuccessSender);
		}
		socketManager.on("matching-success", handleMatchingSuccess);
		socketManager.on("matching-fail", handleMatchingFail);
		// 백업: raw 소켓에도 등록
		if (socketManager.socketInstance?.socket) {
			const socket = socketManager.socketInstance.socket;
			if (role === "sender") {
				socket.on("matching-success-sender", handleMatchingSuccessSender);
			}
			socket.on("matching-success", handleMatchingSuccess);
			socket.on("matching-fail", handleMatchingFail);
		}

		return () => {
			if (role === "sender") {
				socketManager.off(
					"matching-success-sender",
					handleMatchingSuccessSender,
				);
				if (socketManager.socketInstance?.socket) {
					const socket = socketManager.socketInstance.socket;
					socket.off("matching-success-sender", handleMatchingSuccessSender);
				}
			}
			socketManager.off("matching-success", handleMatchingSuccess);
			socketManager.off("matching-fail", handleMatchingFail);
			if (socketManager.socketInstance?.socket) {
				const socket = socketManager.socketInstance.socket;
				socket.off("matching-success", handleMatchingSuccess);
				socket.off("matching-fail", handleMatchingFail);
			}
			clearAllTimers();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [role, matchingUuid]);

	return (
		<>
			<MatchHeader title="매칭 완료" onBack={() => funnel.toStep("profile")} />
			<div className="flex w-full items-center justify-center mobile:pt-0 pt-[110px]">
				<div className="w-full max-w-[1440px] mobile:px-[20px] px-[80px] mobile:pt-[24px] pt-[60px]">
					<div className="mobile:mt-[15px] mt-[72px] mb-[150px] flex w-full flex-col items-center gap-[59px] max-[1300px]:gap-[40px]">
						<div className="flex justify-center gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
							<MatchStartProfile user={authUser} />
							<div>
								<MatchStartProfile
									user={
										matchComplete?.opponent as Partial<OpponentProfilePayload>
									}
									opponent
								/>
								<div className="mt-4 flex w-[560px] flex-col items-center gap-4">
									<div className="font-semibold text-gray-700 text-lg">
										{timeLeft > 0
											? `${timeLeft}초 후 자동으로 매칭이 진행됩니다`
											: "매칭 대기 중..."}
									</div>
									<Button
										variant="default"
										className="h-12 w-full rounded-2xl bg-gray-800 px-8"
										onClick={handleCancel}
									>
										매칭 다시하기
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default MatchCompleteStep;
