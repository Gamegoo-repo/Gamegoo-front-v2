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
	const date = new Date(message.createdAt).toLocaleTimeString("ko-KR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<div className="flex items-end justify-end mb-[10px]">
			<div className="flex items-end">
				{showTime && (
					<p className="mr-[5px] regular-9 text-violet-400">{date}</p>
				)}
				<div
					className={cn(
						"regular-14 text-gray-800 bg-violet-300 rounded-[13px] px-[13px] py-[5px] max-w-[196px] break-keep overflow-wrap-anywhere transition-all duration-300 ease-in-out",
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
