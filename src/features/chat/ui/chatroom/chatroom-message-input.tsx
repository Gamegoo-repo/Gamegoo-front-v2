import { useEffect, useState } from "react";
import { useChatDialogStore } from "@/entities/chat";
import type { SystemData } from "@/features/chat";
import { useSendMessage } from "@/features/chat";
import type { ApiResponseEnterChatroomResponse } from "@/shared/api";
import { useGamegooSocket } from "@/shared/providers/gamegoo-socket-provider";

interface ChatroomMessageInputProps {
	enterData?: ApiResponseEnterChatroomResponse;
}

const ChatroomMessageInput = ({ enterData }: ChatroomMessageInputProps) => {
	const { chatroom } = useChatDialogStore();
	const [message, setMessage] = useState("");
	const [isSystemMsgSent, setIsSystemMsgSent] = useState(false);
	const { mutate: sendMessage, isPending } = useSendMessage();
	const { isConnected } = useGamegooSocket();

	const chatroomUuid = chatroom?.uuid;
	const isBlocked =
		enterData?.data?.blocked || enterData?.data?.blockedByTarget;
	const isBlind = chatroom?.blind;
	// Prefer system data from dialog store (set on startChatroomByBoardId), fallback to enter response
	const systemDataFromStore: SystemData | undefined = useChatDialogStore(
		(state) => state.systemData,
	);
	const clearSystemData = useChatDialogStore((state) => state.clearSystemData);
	const systemData: SystemData | undefined =
		systemDataFromStore || (enterData?.data?.system as SystemData | undefined);

	useEffect(() => {
		setIsSystemMsgSent(false);
	}, [chatroomUuid]);

	const getPlaceholderText = () => {
		if (!isConnected) {
			return "연결 중입니다... 잠시만 기다려주세요.";
		} else if (isBlocked) {
			return "메세지를 보낼 수 없는 상태입니다.";
		} else if (isBlind) {
			return "탈퇴한 유저입니다.";
		}
		return "메시지를 입력하세요...";
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			!chatroomUuid ||
			!message.trim() ||
			isBlocked ||
			isBlind ||
			!isConnected
		) {
			return;
		}

		let emitData: {
			uuid: string;
			message: string;
			system?: SystemData;
		};

		let includedSystem = false;
		if (systemData) {
			if (!isSystemMsgSent) {
				emitData = {
					uuid: chatroomUuid,
					message: message.trim(),
					system: systemData,
				};
				setIsSystemMsgSent(true);
				includedSystem = true;
			} else {
				emitData = {
					uuid: chatroomUuid,
					message: message.trim(),
				};
			}
		} else {
			emitData = {
				uuid: chatroomUuid,
				message: message.trim(),
			};
		}

		sendMessage(emitData, {
			onSuccess: () => {
				setMessage("");
				if (includedSystem) {
					clearSystemData();
				}
			},
			onError: (error) => {
				console.error("Failed to send message:", error);
			},
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.nativeEvent.isComposing) {
			return;
		}

		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
		}
	};

	if (!chatroom) {
		return null;
	}

	return (
		<div className="relative h-[var(--chatroom-input-height)] w-full rounded-b-none bg-white md:rounded-b-[20px]">
			<form
				onSubmit={handleSubmit}
				className="h-full rounded-b-none shadow-[0_4px_46.7px_0_rgba(0,0,0,0.1)] md:rounded-b-[20px]"
			>
				<div className="w-full p-[14px_17px]">
					<textarea
						maxLength={1000}
						value={message}
						onChange={(e) => {
							if (message.length < 1000) {
								setMessage(e.target.value);
							}
						}}
						onKeyDown={handleKeyDown}
						disabled={isPending || isBlocked || isBlind || !isConnected}
						placeholder={getPlaceholderText()}
						className="scrollbar-hide w-full resize-none border-none text-base text-gray-800 focus:outline-none disabled:bg-transparent disabled:placeholder:text-sm"
						style={{
							transform: "scale(0.875)",
							transformOrigin: "top left",
						}}
					/>
				</div>
				<div className="mx-5 mb-5 flex items-center justify-between gap-5">
					<div className="text-violet-400 text-xs">{message.length} / 1000</div>
					<button
						disabled={
							message.length === 0 ||
							isBlocked ||
							isBlind ||
							isPending ||
							!isConnected
						}
						type="submit"
						className={`rounded-[25px] px-5 py-2.5 font-medium text-base text-white transition-colors ${
							isBlocked || isBlind
								? "cursor-default bg-gray-300 text-gray-500"
								: message.length === 0 || isPending || !isConnected
									? "cursor-default bg-gray-300 text-gray-500"
									: "bg-violet-600 hover:bg-violet-700"
						}`}
					>
						{!isConnected ? "연결 중..." : isPending ? "전송 중..." : "전송"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatroomMessageInput;
