import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, type FriendInfoResponse } from "@/shared/api";
import SearchIcon from "@/shared/assets/icons/search.svg?react";
import FriendListContent from "./friend-list-content";

function FriendList() {
	const [searchTerm, setSearchTerm] = useState("");
	const queryClient = useQueryClient();

	const { data: friendsData } = useQuery({
		queryKey: ["friends"],
		queryFn: () => {
			return api.friend.getFriendList();
		},
	});

	const { data: searchData } = useQuery({
		queryKey: ["friends", "search", searchTerm],
		queryFn: () => api.friend.searchFriend(searchTerm),
		enabled: searchTerm.length > 0,
	});

	const { mutate: toggleFavorite } = useMutation({
		mutationFn: (memberId: number) => api.friend.reverseFriendLiked(memberId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friends"] });
		},
	});

	const friends =
		searchTerm !== ""
			? (searchData?.data?.data ?? [])
			: (friendsData?.data?.data?.friendInfoList ?? []);

	const handleFriendClick = (_friend: FriendInfoResponse) => {
		// TODO: 채팅방 열기 로직 추가
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
