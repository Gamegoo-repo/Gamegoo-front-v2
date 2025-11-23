import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useChatDialogStore } from "@/entities/chat";
import type { ChatroomResponse } from "@/shared/api";
import { api, type FriendInfoResponse } from "@/shared/api";
import SearchIcon from "@/shared/assets/icons/search.svg?react";
import FriendListContent from "./friend-list-content";

function FriendList() {
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();
	const { setChatroom, setChatDialogType } = useChatDialogStore();

	const { data: friendsData } = useQuery({
		queryKey: ["friends"],
		queryFn: () => {
			return api.private.friend.getFriendList();
		},
	});

	const { data: searchData } = useQuery({
		queryKey: ["friends", "search", searchTerm],
		queryFn: () => api.private.friend.searchFriend(searchTerm),
		enabled: searchTerm.length > 0,
	});

	const { mutate: toggleFavorite } = useMutation({
		mutationFn: (memberId: number) =>
			api.private.friend.reverseFriendLiked(memberId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friends"] });
		},
	});

	const friends =
		searchTerm !== ""
			? (searchData?.data?.data ?? [])
			: (friendsData?.data?.data?.friendInfoList ?? []);

	const handleFriendClick = async (friend: FriendInfoResponse) => {
		if (!friend.memberId) return;

		try {
			// 친구와의 채팅방 시작
			const response = await api.private.chat.startChatroomByMemberId(
				friend.memberId,
			);
			const chatroomData = response.data?.data;

			if (chatroomData?.uuid) {
				const chatroom: ChatroomResponse = {
					chatroomId: 0, // not provided by enter/start response
					uuid: chatroomData.uuid,
					targetMemberId: chatroomData.memberId || friend.memberId,
					targetMemberName:
						chatroomData.gameName || friend.name || "알 수 없음",
					targetMemberImg:
						chatroomData.memberProfileImg || friend.profileImg || 0,
					friend: chatroomData.friend,
					blocked: chatroomData.blocked,
					blind: chatroomData.blind,
					notReadMsgCnt: 0, // default on entry
				};
				setChatroom(chatroom);
				setChatDialogType("chatroom");
			}
		} catch (error) {
			console.error("채팅방 시작 실패:", error);
		}
	};

	const handleFavoriteToggle = (friend: FriendInfoResponse) => {
		if (!friend.memberId) {
			return;
		}
		toggleFavorite(friend.memberId);
	};

	const favoriteFriends = friends.filter((f) => f.liked);
	const filteredFriends = friends.filter(
		(friend) =>
			searchTerm === "" ||
			friend.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const hasNoFriends = friends.length === 0 && searchTerm === "";

	return (
		<>
			{/* 검색바 */}
			<div className="p-4 border-b border-gray-200">
				<div className="relative flex pl-[32px] items-center bg-gray-100 rounded-lg">
					<SearchIcon
						width="16"
						height="16"
						className="absolute top-[11px] left-[15px]"
					/>
					<input
						type="text"
						placeholder="친구 검색하기"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-3 py-2 focus:outline-none"
					/>
				</div>
			</div>
			<div className="overflow-y-auto">
				<FriendListContent
					hasNoFriends={hasNoFriends}
					favoriteFriends={favoriteFriends}
					filteredFriends={filteredFriends}
					handleFriendClick={handleFriendClick}
					handleFavoriteToggle={handleFavoriteToggle}
				/>
			</div>
		</>
	);
}

export default FriendList;
