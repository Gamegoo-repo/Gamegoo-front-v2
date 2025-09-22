import { useChatStore } from "@/entities/chat";
import FriendLists from "./tab-contents/friend-list";

interface ChatContentProps {
	activeTab: number;
}

function ChatContent({ activeTab }: ChatContentProps) {
	const { chatrooms } = useChatStore();

	if (activeTab === 0) {
		return <FriendLists />;
	}

	return (
		<div>
			{/* 콘텐츠 영역 */}
			<div className="overflow-y-auto">
				<div>
					{chatrooms.length > 0 ? (
						chatrooms.map((chatroom) => (
							<button
								key={chatroom.chatroomId}
								type="button"
								className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer w-full text-left"
								onClick={() =>
									console.log("채팅방 클릭:", chatroom.targetMemberName)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										console.log("채팅방 클릭:", chatroom.targetMemberName);
									}
								}}
							>
								<div className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white font-medium">
									{chatroom.targetMemberName[0]}
								</div>
								<div className="ml-3 flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<p className="font-medium text-gray-900 truncate">
											{chatroom.targetMemberName}
										</p>
										<p className="text-xs text-gray-500">
											{new Date(chatroom.lastMsgAt).toLocaleTimeString()}
										</p>
									</div>
									<p className="text-sm text-gray-600 truncate">
										{chatroom.lastMsg}
									</p>
								</div>
								{chatroom.notReadMsgCnt > 0 && (
									<div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
										{chatroom.notReadMsgCnt > 9 ? "9+" : chatroom.notReadMsgCnt}
									</div>
								)}
								<button
									type="button"
									className="ml-2 text-gray-400 hover:text-gray-600"
									onClick={(e) => {
										e.stopPropagation();
										console.log("더보기 클릭:", chatroom.targetMemberName);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											e.stopPropagation();
											console.log("더보기 클릭:", chatroom.targetMemberName);
										}
									}}
									aria-label="더보기 옵션"
								>
									⋮
								</button>
							</button>
						))
					) : (
						<div className="p-8 text-center text-gray-500">
							<p>채팅방이 없습니다.</p>
							<p className="text-sm mt-1">친구와 대화를 시작해보세요!</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ChatContent;
