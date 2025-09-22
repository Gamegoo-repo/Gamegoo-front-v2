import { useState } from "react";
import { useChatStore } from "@/entities/chat";

interface ChatContentProps {
	activeTab: number;
}

function ChatContent({ activeTab }: ChatContentProps) {
	const { chatrooms } = useChatStore();
	const [searchTerm, setSearchTerm] = useState("");

	// 친구 목록 (예시 데이터)
	const [friends] = useState([
		{ id: 1, name: "친구1", isOnline: true, profileImg: 1 },
		{ id: 2, name: "친구2", isOnline: false, profileImg: 2 },
		{ id: 3, name: "친구3", isOnline: true, profileImg: 3 },
	]);

	const contentHeight = activeTab === 0 ? "508px" : "590px";

	return (
		<div>
			{/* 검색바 - 친구 목록 탭에서만 표시 */}
			{activeTab === 0 && (
				<div className="p-4 border-b border-gray-200">
					<input
						type="text"
						placeholder="친구 검색..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
					/>
				</div>
			)}

			{/* 콘텐츠 영역 */}
			<div
				className="overflow-y-auto"
				style={{
					height: contentHeight,
				}}
			>
				{activeTab === 0 ? (
					// 친구 목록
					<div className="p-4">
						<h3 className="text-sm font-medium text-gray-700 mb-3">즐겨찾기</h3>
						<div className="space-y-2 mb-6">
							{friends
								.filter((f) => f.isOnline)
								.map((friend) => (
									<button
										key={friend.id}
										type="button"
										className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer w-full text-left"
										onClick={() => console.log('친구 클릭:', friend.name)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												console.log('친구 클릭:', friend.name);
											}
										}}
									>
										<div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white font-medium">
											{friend.name[0]}
										</div>
										<div className="ml-3 flex-1">
											<p className="font-medium text-gray-900">{friend.name}</p>
											<p className="text-sm text-green-500">온라인</p>
										</div>
										<button 
											type="button"
											className="text-yellow-500 hover:text-yellow-600"
											onClick={(e) => {
												e.stopPropagation();
												console.log('즐겨찾기 토글:', friend.name);
											}}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													e.stopPropagation();
													console.log('즐겨찾기 토글:', friend.name);
												}
											}}
											aria-label="즐겨찾기 토글"
										>
											⭐
										</button>
									</button>
								))}
						</div>

						<h3 className="text-sm font-medium text-gray-700 mb-3">
							친구 목록
						</h3>
						<div className="space-y-2">
							{friends.map((friend) => (
								<button
									key={friend.id}
									type="button"
									className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer w-full text-left"
									onClick={() => console.log('친구 클릭:', friend.name)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											console.log('친구 클릭:', friend.name);
										}
									}}
								>
									<div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white font-medium">
										{friend.name[0]}
									</div>
									<div className="ml-3 flex-1">
										<p className="font-medium text-gray-900">{friend.name}</p>
										<p
											className={`text-sm ${friend.isOnline ? "text-green-500" : "text-gray-400"}`}
										>
											{friend.isOnline ? "온라인" : "오프라인"}
										</p>
									</div>
									<button 
										type="button"
										className="text-gray-400 hover:text-yellow-500"
										onClick={(e) => {
											e.stopPropagation();
											console.log('즐겨찾기 추가:', friend.name);
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												console.log('즐겨찾기 추가:', friend.name);
											}
										}}
										aria-label="즐겨찾기 추가"
									>
										☆
									</button>
								</button>
							))}
						</div>
					</div>
				) : (
					// 채팅방 목록
					<div>
						{chatrooms.length > 0 ? (
							chatrooms.map((chatroom) => (
								<button
									key={chatroom.chatroomId}
									type="button"
									className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer w-full text-left"
									onClick={() => console.log('채팅방 클릭:', chatroom.targetMemberName)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											console.log('채팅방 클릭:', chatroom.targetMemberName);
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
											{chatroom.notReadMsgCnt > 9
												? "9+"
												: chatroom.notReadMsgCnt}
										</div>
									)}
									<button 
										type="button"
										className="ml-2 text-gray-400 hover:text-gray-600"
										onClick={(e) => {
											e.stopPropagation();
											console.log('더보기 클릭:', chatroom.targetMemberName);
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												e.stopPropagation();
												console.log('더보기 클릭:', chatroom.targetMemberName);
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
				)}
			</div>
		</div>
	);
}

export { ChatContent };
