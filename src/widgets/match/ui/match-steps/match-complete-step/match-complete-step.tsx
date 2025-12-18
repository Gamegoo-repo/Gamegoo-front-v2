import { useEffect, useRef, useState } from "react";
import { useChatDialogStore } from "@/entities/chat";
import type { ChatroomResponse, EnterChatroomResponse } from "@/shared/api";
import { api } from "@/shared/api";
import { toast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../../hooks";
import { matchFlow } from "../../../lib/match-flow";
import type { OpponentProfilePayload } from "../../../lib/matching-types";
import MatchHeader from "../../match-header";
import MatchStartProfile from "../match-start-step/match-start-profile";

const MATCHING_COMPLETE_TIME = 10; // 10초

interface MatchCompleteStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchCompleteStep({ funnel }: MatchCompleteStepProps) {
	const [timeLeft, setTimeLeft] = useState(MATCHING_COMPLETE_TIME);
	const [isMatched, setIsMatched] = useState(false);
	const authUser = funnel.user;
	const matchComplete = funnel.matchComplete;
	const role = matchComplete?.role;
	const matchingUuid = matchComplete?.matchingUuid;
	const mainTimerRef = useRef<NodeJS.Timeout | null>(null);
	const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null);
	const finalTimerRef = useRef<NodeJS.Timeout | null>(null);
	const didSendSuccessReceiverRef = useRef(false);
	const didSendSuccessFinalRef = useRef(false);
	const sessionIdRef = useRef(0);

	// 공통 클린업
	const clearAllTimers = () => {
		if (mainTimerRef.current) clearInterval(mainTimerRef.current);
		if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
		if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
	};

	// 매칭 취소 핸들러
	const handleCancel = () => {
		// 매칭 취소 이벤트 전송
		matchFlow.reject(sessionIdRef.current);

		// 모든 타이머 정리
		clearAllTimers();

		// 프로필 단계로 이동
		funnel.toStep("profile");
		toast.error("화면 이탈로 매칭이 종료되었습니다.");
	};

	useEffect(() => {
		// 완료 단계 진입 마크 (quit 방지)
		matchFlow.beginCompletePhase();
		sessionIdRef.current = matchFlow.getSessionId();

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
							matchFlow.completeAsReceiver(matchingUuid);
						} else {
							console.warn(
								"⚠️ [V2-Complete] 중복 matching-success-receiver 차단",
							);
						}
						// 5초 대기 후 실패 처리
						secondaryTimerRef.current = setTimeout(() => {
							matchFlow.fail();
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
				matchFlow.completeAsSenderFinal();
			} else {
				console.warn("⚠️ [V2-Complete] 중복 matching-success-final 차단");
			}
			finalTimerRef.current = setTimeout(() => {
				matchFlow.fail();
			}, 3000);
		};

		const handleMatchingSuccess = async (_res: unknown) => {
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

				const createFallbackChatroom = (uuid: string): ChatroomResponse => ({
					chatroomId: 0,
					uuid: uuid,
					targetMemberId: 0,
					targetMemberImg: 0,
					targetMemberName:
						(opponent?.gameName as string | undefined) || "상대",
					friend: false,
					blocked: false,
					blind: false,
					notReadMsgCnt: 0,
				});

				const { openDialog, setChatDialogType, setChatroom } =
					useChatDialogStore.getState();

				// 채팅방 정보를 API로 조회해 헤더 아바타/닉네임을 정확히 표시 (floating modal 진입과 동일)
				try {
					const enterRes = await api.private.chat.enterChatroom(chatroomUuid);
					const enterData = enterRes.data?.data as
						| EnterChatroomResponse
						| undefined;
					if (enterData) {
						// EnterChatroomResponse -> ChatroomResponse 매핑
						const mapped: ChatroomResponse = {
							chatroomId: 0,
							uuid: enterData.uuid,
							targetMemberId: enterData.memberId,
							targetMemberImg: enterData.memberProfileImg,
							targetMemberName: enterData.gameName,
							friend: enterData.friend,
							blocked: enterData.blocked,
							blind: enterData.blind,
							notReadMsgCnt: 0,
						};
						setChatroom(mapped);
					} else {
						setChatroom(createFallbackChatroom(chatroomUuid));
					}
				} catch (e) {
					console.error("enterChatroom 호출 실패:", e);
					setChatroom(createFallbackChatroom(chatroomUuid));
				}
				setChatDialogType("chatroom");
				openDialog();
				setIsMatched(true);
				// 최종 성공 단계 반영 (quit 억제)
				matchFlow.markSuccess();
			} catch (e) {
				console.error("채팅 전환 처리 중 오류:", e);
			}
		};

		const handleMatchingFail = () => {
			clearAllTimers();
			funnel.toStep("profile");
			toast.error("채팅 연결에 실패했어요. 다시 시도해 주세요.");
		};

		if (role === "sender") {
			matchFlow.on("matching-success-sender", handleMatchingSuccessSender);
		}
		matchFlow.on("matching-success", handleMatchingSuccess);
		matchFlow.on("matching-fail", handleMatchingFail);

		return () => {
			if (role === "sender") {
				matchFlow.off("matching-success-sender", handleMatchingSuccessSender);
			}
			matchFlow.off("matching-success", handleMatchingSuccess);
			matchFlow.off("matching-fail", handleMatchingFail);
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
										{isMatched
											? "매칭 완료"
											: timeLeft > 0
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
