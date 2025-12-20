import { useMemo } from "react";
import { useChatDialogStore, useChatStore } from "@/entities/chat";
import {
	BadMannerEvaluateMenuItem,
	BlockMenuItem,
	ChatroomLeaveMenuItem,
	FriendAddMenuItem,
	FriendDeleteMenuItem,
	MannerEvaluateMenuItem,
	PopoverMenu,
	ReportMenuItem,
	UnblockMenuItem,
} from "@/features/popover-menu";
import { ProfileAvatar } from "@/features/profile";
import type { ApiResponseEnterChatroomResponse } from "@/shared/api";
import LeftArrowIcon from "@/shared/assets/icons/left_arrow.svg?react";

interface ChatroomHeaderProps {
	enterData?: ApiResponseEnterChatroomResponse;
}

const ChatroomHeader = ({ enterData }: ChatroomHeaderProps) => {
	const { chatroom, setChatDialogType } = useChatDialogStore();
	const { onlineFriends } = useChatStore();
	const isOnline = chatroom?.targetMemberId
		? onlineFriends.includes(chatroom.targetMemberId)
		: false;

	const isFriend = enterData?.data?.friend;
	const MENU_ITEMS = useMemo(() => {
		const items: React.ReactElement[] = [
			<ChatroomLeaveMenuItem key="leave" chatroomId={chatroom?.uuid || ""} />,
		];

		if (!isFriend && !enterData?.data?.friendRequestMemberId) {
			items.push(
				<FriendAddMenuItem
					key="friend-add"
					userId={chatroom?.targetMemberId || 0}
				/>,
			);
		}

		if (isFriend) {
			items.push(
				<FriendDeleteMenuItem
					key="friend-delete"
					userId={chatroom?.targetMemberId || 0}
				/>,
			);
		}

		items.push(
			<ReportMenuItem
				key="report"
				userId={chatroom?.targetMemberId || 0}
				reportType="CHAT"
			/>,
		);

		// 차단하기: 이미 차단했거나 상대가 나를 차단한 경우는 노출하지 않음
		if (!enterData?.data?.blocked && !enterData?.data?.blockedByTarget) {
			items.push(
				<BlockMenuItem
					key="block"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
		}

		// 차단 해제: 내가 차단한 경우 노출
		if (enterData?.data?.blocked) {
			items.push(
				<UnblockMenuItem
					key="unblock"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
		}

		items.push(<MannerEvaluateMenuItem key="manner-evaluate" />);
		items.push(<BadMannerEvaluateMenuItem key="bad-manner-evaluate" />);

		return items;
	}, [
		isFriend,
		enterData?.data?.friendRequestMemberId,
		chatroom?.uuid,
		chatroom?.targetMemberId,
		enterData?.data?.blocked,
	]);

	return (
		<div className="flex h-[var(--chatroom-header-height)] px-[12px] pt-[12px]">
			<div className="flex w-full items-center gap-2 border-violet-300 border-b py-2 pl-2">
				<LeftArrowIcon
					className="cursor-pointer"
					onClick={() => setChatDialogType("chatroom-list")}
				/>
				<ProfileAvatar size="md" profileIndex={chatroom?.targetMemberImg} />
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<div className="relative">
							<p className="font-medium text-gray-900">
								{chatroom?.targetMemberName}
							</p>
							{isOnline && (
								<div className="-top-1 -right-2 absolute h-[7px] w-[7px] rounded-full bg-green-500" />
							)}
							<p className="regular-11 text-gray-600">
								{isOnline ? "온라인" : "오프라인"}
							</p>
						</div>
					</div>
				</div>
				{<PopoverMenu menuItems={MENU_ITEMS} />}
			</div>
		</div>
	);
};

export default ChatroomHeader;
