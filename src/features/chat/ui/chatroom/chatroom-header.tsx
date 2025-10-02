import { useChatStore } from "@/entities/chat";
import ProfileAvatar from "@/features/profile/profile-avatar";
import LeftArrowIcon from "@/shared/assets/icons/left_arrow.svg?react";
import { useChatDialogStore } from "../../model/store";

const ChatroomHeader = () => {
	const { chatroom, setChatDialogType } = useChatDialogStore();
	const { onlineFriends } = useChatStore();
	const isOnline = chatroom?.targetMemberId
		? onlineFriends.includes(chatroom.targetMemberId)
		: false;

	return (
		<div className="flex px-[12px] pt-[12px]">
			<div className="flex w-full py-2 pl-2 gap-2 border-b border-violet-300 items-center">
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
								<div className="absolute -top-1 -right-2 w-[7px] h-[7px] bg-green-500 rounded-full" />
							)}
							<p className="regular-11 text-gray-600">
								{isOnline ? "온라인" : "오프라인"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatroomHeader;
