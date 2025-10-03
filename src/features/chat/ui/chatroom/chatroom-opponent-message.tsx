import type { ChatMessage } from "@/entities/chat";
import ProfileAvatar from "@/features/profile/profile-avatar";
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
	const date = new Date(message.createdAt ?? "").toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="flex justify-start items-end mb-[10px]">
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
				<div className="regular-14 text-gray-800 bg-white rounded-[13px] px-[13px] py-[5px] max-w-[229px] break-words">
					{message.message}
				</div>
				{showTime && (
					<p className="ml-[9px] regular-9 text-violet-400">{date}</p>
				)}
			</div>
		</div>
	);
};

export default ChatroomOpponentMessage;
