import type { FC } from "react";
import { useChatStore } from "@/entities/chat";
import MessageIcon from "@/shared/assets/icons/message.svg?react";
import { Badge } from "@/shared/ui/badge";

export interface FloatingChatButtonProps {
	onClick?: () => void;
}

const FloatingChatButton: FC<FloatingChatButtonProps> = ({ onClick }) => {
	const unreadRoomCount = useChatStore(
		(state) => state.chatrooms.filter((r) => (r.notReadMsgCnt || 0) > 0).length,
	);
	const displayCount = unreadRoomCount > 99 ? "99+" : unreadRoomCount;

	return (
		<div className="fixed right-6 bottom-6 z-50">
			<div className="relative">
				<button
					type="button"
					onClick={onClick}
					className="flex h-22 w-22 items-center justify-center rounded-full bg-gradient-to-r bg-violet-600 text-white shadow-xl focus:outline-none focus:ring-4"
				>
					<MessageIcon />
				</button>
			</div>
			<Badge className="-top-0 -right-0 absolute h-6 w-6 rounded-full border-1 border-violet-400 bg-violet-100 text-violet-600">
				{displayCount}
			</Badge>
		</div>
	);
};

export default FloatingChatButton;
