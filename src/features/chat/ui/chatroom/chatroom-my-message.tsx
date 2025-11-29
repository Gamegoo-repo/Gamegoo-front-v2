import type { ChatMessage } from "@/entities/chat";
import { cn } from "@/shared/lib/utils";

interface ChatroomMyMessageProps {
	message: ChatMessage;
	showTime: boolean;
	isLast: boolean;
	isAnimated: boolean;
}

const ChatroomMyMessage = ({
	message,
	showTime,
	isLast,
	isAnimated,
}: ChatroomMyMessageProps) => {
	const date = new Date(message.timestamp || 0).toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="mb-[10px] flex items-end justify-end">
			<div className="flex items-end">
				{showTime && (
					<p className="regular-9 mr-[5px] text-violet-400">{date}</p>
				)}
				<div
					className={cn(
						"regular-14 max-w-[196px] break-words rounded-[13px] bg-violet-300 px-[13px] py-[5px] text-gray-800 transition-all duration-300 ease-in-out",
						isAnimated && isLast && "animate-slide-down",
					)}
				>
					{message.message}
				</div>
			</div>
		</div>
	);
};

export default ChatroomMyMessage;
