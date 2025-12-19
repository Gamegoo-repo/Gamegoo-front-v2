import { useChatDialogStore } from "@/entities/chat";
import { ChatroomLeaveMenuItem, PopoverMenu } from "@/features/popover-menu";
import { ProfileAvatar } from "@/features/profile";
import type { ChatroomResponse } from "@/shared/api/@generated/models/chatroom-response";
import { cn } from "@/shared/lib/utils";

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

	const MENU_ITEMS = [
		<ChatroomLeaveMenuItem key="leave" chatroomId={room.uuid || ""} />,
	];

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
				"relative flex w-full cursor-pointer items-start justify-between gap-2 p-4",
				"transition-colors hover:bg-gray-50",
				className,
			)}
			onClick={handleChatroomClick}
		>
			<div className="flex flex-1 items-center">
				<ProfileAvatar size="sm" profileIndex={room.targetMemberImg} />
				<div className="ml-3.5 min-w-0 flex-1">
					<div className="min-w-75">
						<div className="mb-0.5 flex h-4.25 items-center justify-between">
							<span className="font-semibold text-gray-800 text-sm">
								{room.targetMemberName}
							</span>
							{room.notReadMsgCnt !== 0 && (
								<span className="regular-11 rounded-full bg-violet-600 px-1.25 py-0 text-white">
									{formatUnreadCount(room.notReadMsgCnt || 0)}
								</span>
							)}
						</div>
						<div className="flex h-4.25 items-center justify-between">
							<span className="regular-14 flex w-53.75 truncate">
								{room.lastMsg}
							</span>
							<span className="regular-11 text-gray-300">
								{room.lastMsgAt && formatChatDate(room.lastMsgAt)}
							</span>
						</div>
					</div>
				</div>
			</div>

			<PopoverMenu menuItems={MENU_ITEMS} />
		</button>
	);
}

export default ChatroomItem;
