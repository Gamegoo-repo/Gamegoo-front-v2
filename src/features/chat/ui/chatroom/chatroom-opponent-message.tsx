import type { ChatMessage } from "@/entities/chat";
import { ProfileAvatar } from "@/features/profile";
import { cn } from "@/shared/lib/utils";

interface ChatroomOpponentMessageProps {
	message: ChatMessage;
	showTime: boolean;
	showProfileImage: boolean;
}

const ChatroomOpponentMessage = ({
	message,
	showTime,
	showProfileImage,
}: ChatroomOpponentMessageProps) => {
	const date = new Date(message.timestamp || 0).toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="mb-[10px] flex items-end justify-start">
			{showProfileImage && (
				<ProfileAvatar
					profileIndex={message.senderProfileImg ?? undefined}
					size="sm"
				/>
			)}
			<div
				className={cn(
					"flex items-end",
					showProfileImage ? "ml-[11px]" : "ml-[58.43px]",
				)}
			>
				<div className="regular-14 max-w-[229px] break-words rounded-[13px] bg-white px-[13px] py-[5px] text-gray-800">
					{message.message}
				</div>
				{showTime && (
					<p className="regular-9 ml-[9px] text-violet-400">{date}</p>
				)}
			</div>
		</div>
	);
};

export default ChatroomOpponentMessage;
