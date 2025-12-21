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

const MATCHING_COMPLETE_TIME = 10;

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

	const clearAllTimers = () => {
		if (mainTimerRef.current) clearInterval(mainTimerRef.current);
		if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current);
		if (finalTimerRef.current) clearTimeout(finalTimerRef.current);
	};

	const handleCancel = () => {
		matchFlow.reject(sessionIdRef.current);
		clearAllTimers();
		funnel.toStep("profile");
		if (!isMatched) {
			toast.error("화면 이탈로 매칭이 종료되었습니다.");
		}
	};

	useEffect(() => {
		matchFlow.beginCompletePhase();
		sessionIdRef.current = matchFlow.getSessionId();

		mainTimerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					if (mainTimerRef.current) {
						clearInterval(mainTimerRef.current);
						mainTimerRef.current = null;
					}

					if (role === "receiver" && matchingUuid) {
						if (!didSendSuccessReceiverRef.current) {
							didSendSuccessReceiverRef.current = true;
							matchFlow.completeAsReceiver(matchingUuid);
						}
						secondaryTimerRef.current = setTimeout(() => {
							matchFlow.fail();
						}, 5000);
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		const handleMatchingSuccessSender = () => {
			if (!didSendSuccessFinalRef.current) {
				didSendSuccessFinalRef.current = true;
				matchFlow.completeAsSenderFinal();
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
						opponent?: { gameName?: string };
					};
					chatroomUuid?: string;
					opponent?: { gameName?: string };
				};

				const chatroomUuid =
					payload?.data?.chatroomUuid ?? payload?.chatroomUuid ?? null;

				if (!chatroomUuid) return;

				const opponent =
					payload?.data?.opponent ??
					payload?.opponent ??
					matchComplete?.opponent;

				const createFallbackChatroom = (uuid: string): ChatroomResponse => ({
					chatroomId: 0,
					uuid,
					tag: "",
					targetMemberId: 0,
					targetMemberImg: 0,
					targetMemberName: opponent?.gameName ?? "상대",
					friend: false,
					blind: false,
					notReadMsgCnt: 0,
				});

				const { openDialog, setChatDialogType, setChatroom } =
					useChatDialogStore.getState();

				try {
					const enterRes = await api.private.chat.enterChatroom(chatroomUuid);
					const enterData = enterRes.data?.data as
						| EnterChatroomResponse
						| undefined;

					if (enterData) {
						setChatroom({
							chatroomId: 0,
							uuid: enterData.uuid,
							targetMemberId: enterData.memberId,
							tag: enterData.tag,
							targetMemberImg: enterData.memberProfileImg,
							targetMemberName: enterData.gameName,
							friend: enterData.friend,
							blind: enterData.blind,
							notReadMsgCnt: 0,
						});
					} else {
						setChatroom(createFallbackChatroom(chatroomUuid));
					}
				} catch {
					setChatroom(createFallbackChatroom(chatroomUuid));
				}

				setChatDialogType("chatroom");
				openDialog();
				setIsMatched(true);
				matchFlow.markSuccess();
			} catch (e) {
				console.error(e);
			}
		};

		const handleMatchingFail = () => {
			clearAllTimers();
			funnel.toStep("profile");
			toast.error("매칭에 실패했어요. 다시 시도해 주세요.");
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
			<MatchHeader title="매칭 완료" onBack={handleCancel} />

			<div className="flex w-full items-center justify-center">
				<div className="w-full max-w-[1440px]">
					<div className="mobile:mt-[70px] mt-[30px] mb-[150px] flex w-full flex-col items-center justify-center mobile:px-[0px] px-[10px]">
						<div className="flex mobile:grid w-full mobile:grid-cols-2 flex-col mobile:items-start items-center mobile:justify-items-center gap-[40px] mobile:gap-[24px]">
							<MatchStartProfile user={authUser} />

							<MatchStartProfile
								user={
									matchComplete?.opponent as Partial<OpponentProfilePayload>
								}
								opponent
							/>

							<div className="mobile:block hidden" />

							<div className="flex w-full max-w-[560px] flex-col items-center mobile:items-stretch gap-4">
								<div className="text-center font-semibold mobile:text-lg text-base text-gray-700">
									{isMatched
										? "매칭 완료"
										: timeLeft > 0
											? `${timeLeft}초 후 자동으로 매칭이 진행됩니다`
											: "매칭 대기 중..."}
								</div>

								<Button
									variant="default"
									className="h-12 w-full rounded-2xl bg-gray-800"
									onClick={handleCancel}
								>
									매칭 다시하기
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default MatchCompleteStep;
