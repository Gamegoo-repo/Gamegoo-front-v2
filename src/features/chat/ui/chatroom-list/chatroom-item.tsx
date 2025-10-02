import ProfileAvatar from "@/features/profile/profile-avatar";
import type { ChatroomResponse } from "@/shared/api/@generated/models/chatroom-response";
import ThreeDotsButtonBlack from "@/shared/assets/icons/three_dots_button_black.svg?react";
import { cn } from "@/shared/lib/utils";
import { useChatDialogStore } from "../../model/store";

interface ChatroomItemProps {
	room: ChatroomResponse;
	onChatRoom: (id: string) => void;
	className?: string;
}

const formatUnreadCount = (unread: number) => {
	return unread > 99 ? "99+" : unread.toString();
};

const formatChatDate = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes < 60) {
		return `${diffInMinutes}분 전`;
	}
	if (diffInHours < 24) {
		return `${diffInHours}시간 전`;
	}
	if (diffInDays < 7) {
		return `${diffInDays}일 전`;
	}
	return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
};

// TODO: 더보기 메뉴 추가

function ChatroomItem({ room, className }: ChatroomItemProps) {
	const { setChatDialogType, setChatroom } = useChatDialogStore();

	const handleChatroomClick = () => {
		if (room.uuid) {
			setChatDialogType("chatroom");
			setChatroom(room);
		}
	};

	return (
		<button
			type="button"
			className={cn(
				"relative flex w-full items-start justify-between cursor-pointer p-4 gap-2",
				"hover:bg-gray-50 transition-colors",
				className,
			)}
			onClick={handleChatroomClick}
		>
			<div className="flex items-center flex-1">
				<ProfileAvatar size="sm" profileIndex={room.targetMemberImg} />
				<div className="flex-1 min-w-0 ml-3.5">
					<div className="hidden md:block min-w-75">
						<div className="flex items-center justify-between h-4.25 mb-0.5">
							<span className="font-semibold text-sm text-gray-800">
								{room.targetMemberName}
							</span>
							{room.notReadMsgCnt !== 0 && (
								<span className="px-1.25 py-0 bg-violet-600 text-white regular-11 rounded-full">
									{formatUnreadCount(room.notReadMsgCnt || 0)}
								</span>
							)}
						</div>
						<div className="flex items-center justify-between h-4.25">
							<span className="flex regular-14 truncate w-53.75">
								{room.lastMsg}
							</span>
							<span className="regular-11 text-gray-300">
								{room.lastMsgAt && formatChatDate(room.lastMsgAt)}
							</span>
						</div>
					</div>
				</div>
			</div>

			<button
				type="button"
				className="w-5 h-5 mt-1 flex items-center justify-center p-0.5 hover:bg-gray-100 rounded transition-colors"
				onClick={() => {}}
			>
				<ThreeDotsButtonBlack />
			</button>
		</button>
	);
}

export default ChatroomItem;
