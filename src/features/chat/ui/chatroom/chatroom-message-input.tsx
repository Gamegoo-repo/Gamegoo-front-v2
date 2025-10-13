import { useEffect, useState } from "react";
import { useEnterChatroom } from "@/features/chat/api/use-chatroom-enter";
import { useSendMessage } from "@/features/chat/api/use-send-message";
import type { SystemData } from "@/features/chat/lib/types";
import { useChatDialogStore } from "@/widgets/floating-chat-dialog/store/use-chat-dialog-store";

const ChatroomMessageInput = () => {
	const { chatroom } = useChatDialogStore();
	const [message, setMessage] = useState("");
	const [isSystemMsgSent, setIsSystemMsgSent] = useState(false);
	const { mutate: sendMessage, isPending } = useSendMessage();
	const { data: enterData } = useEnterChatroom(chatroom?.uuid || null);

	const chatroomUuid = chatroom?.uuid;
	const isBlocked = chatroom?.blocked;
	const isBlind = chatroom?.blind;
	const systemData: SystemData | undefined = enterData?.data?.system;

	useEffect(() => {
		setIsSystemMsgSent(false);
	}, [chatroomUuid]);

	const getPlaceholderText = () => {
		if (isBlocked) {
			return "메세지를 보낼 수 없는 상태입니다.";
		} else if (isBlind) {
			return "탈퇴한 유저입니다.";
		}
		return "메시지를 입력하세요...";
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!chatroomUuid || !message.trim() || isBlocked || isBlind) {
			return;
		}

		let emitData: {
			uuid: string;
			message: string;
			system?: SystemData;
		};

		if (systemData) {
			if (!isSystemMsgSent) {
				emitData = {
					uuid: chatroomUuid,
					message: message.trim(),
					system: systemData,
				};
				setIsSystemMsgSent(true);
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
		<div className="relative bg-white h-[138px] w-full rounded-b-[20px]">
			<form
				onSubmit={handleSubmit}
				className="h-full rounded-b-[20px] shadow-[0_4px_46.7px_0_rgba(0,0,0,0.1)]"
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
						disabled={isPending || isBlocked || isBlind}
						placeholder={getPlaceholderText()}
						className="border-none w-full text-base text-gray-800 resize-none focus:outline-none disabled:bg-transparent disabled:placeholder:text-gray-800 disabled:placeholder:font-semibold disabled:placeholder:text-sm scrollbar-hide"
						style={{
							transform: "scale(0.875)",
							transformOrigin: "top left",
						}}
					/>
				</div>
				<div className="flex justify-between items-center gap-5 mx-5 mb-5">
					<div className="text-violet-400 text-xs">{message.length} / 1000</div>
					<button
						disabled={message.length === 0 || isBlocked || isBlind || isPending}
						type="submit"
						className={`font-medium text-base text-white rounded-[25px] px-5 py-2.5 transition-colors ${
							isBlocked || isBlind
								? "bg-gray-300 text-gray-500 cursor-default"
								: message.length === 0 || isPending
									? "bg-gray-300 text-gray-500 cursor-default"
									: "bg-violet-600 hover:bg-violet-700"
						}`}
					>
						{isPending ? "전송 중..." : "전송"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ChatroomMessageInput;
