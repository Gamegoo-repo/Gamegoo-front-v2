import type { FC } from "react";
import { useChatStore } from "@/entities/chat";
import MessageIcon from "@/shared/icons/message.svg?react";
import { Badge } from "@/shared/ui/Badge";

export interface FloatingChatButtonProps {
	onClick?: () => void;
}

const FloatingChatButton: FC<FloatingChatButtonProps> = ({ onClick }) => {
	const totalUnreadCount = useChatStore((state) => state.totalUnreadCount);
	const displayCount = totalUnreadCount > 99 ? "99+" : totalUnreadCount;

	return (
		<div className="fixed z-50 bottom-6 right-6">
			<div className="relative">
				<button
					type="button"
					onClick={onClick}
					className="h-22 w-22 rounded-full focus:outline-none focus:ring-4 bg-gradient-to-r bg-violet-600 text-white shadow-xl flex items-center justify-center"
				>
					<MessageIcon />
				</button>
			</div>
			<Badge className="absolute -top-0 -right-0 h-6 w-6 rounded-full bg-violet-100 border-1 border-violet-400 text-violet-600">
				{displayCount}
			</Badge>
		</div>
	);
};

export default FloatingChatButton;
