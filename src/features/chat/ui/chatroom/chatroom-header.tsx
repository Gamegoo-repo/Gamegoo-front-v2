import { useChatDialogStore, useChatStore } from "@/entities/chat";
import { FriendDeleteMenuItem, PopoverMenu } from "@/features/popover-menu";
import { ProfileAvatar } from "@/features/profile";
import LeftArrowIcon from "@/shared/assets/icons/left_arrow.svg?react";

const ChatroomHeader = () => {
	const { chatroom, setChatDialogType } = useChatDialogStore();
	const { onlineFriends } = useChatStore();
	const isOnline = chatroom?.targetMemberId
		? onlineFriends.includes(chatroom.targetMemberId)
		: false;

	const MENU_ITEMS = [
		<FriendDeleteMenuItem
			key="friend-delete"
			userId={chatroom?.targetMemberId || 0}
		/>,
		// 채팅방 나가기
		// 친구 삭제 / 요청 / 요청 취소
		// 차단하기
		// 신고하기
		// 매너 평가
		// 비매너 평가
	];

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
