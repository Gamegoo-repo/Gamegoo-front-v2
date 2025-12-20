import { useChatStore } from "@/entities/chat";
import { useChatroomListManager } from "@/features/chat";
import ChatroomItem from "./chatroom-item";

const ChatroomList = () => {
	const { chatrooms } = useChatStore();
	const { isFetching: isLoading, error } = useChatroomListManager();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8 text-gray-500">
				로딩 중...
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8 text-red-500">
				채팅방 목록을 불러오는데 실패했습니다.
			</div>
		);
	}

	if (chatrooms.length === 0) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-16">
				<div className="text-center">
					<p className="regular-16 mb-2 text-gray-700">
						생성된 채팅방이 없습니다.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="modal-scrollbar-custom overflow-y-auto">
			{chatrooms.map((room) => (
				<ChatroomItem key={room.uuid} room={room} onChatRoom={() => {}} />
			))}
		</div>
	);
};

export default ChatroomList;
