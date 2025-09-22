import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api, type FriendInfoResponse } from "@/shared/api";
import SearchIcon from "@/shared/icons/search.svg?react";
import FriendSection from "./friend-section";

function FriendLists() {
	const [searchTerm, setSearchTerm] = useState("");

	const { data: friendsData } = useQuery({
		queryKey: ["friends"],
		queryFn: () => api.friend.getFriendList(),
	});

	const { data: searchData } = useQuery({
		queryKey: ["friends", "search", searchTerm],
		queryFn: () => api.friend.searchFriend(searchTerm),
		enabled: searchTerm.length > 0,
	});

	const friends =
		searchTerm !== ""
			? (searchData?.data?.data ?? [])
			: (friendsData?.data?.data?.friendInfoList ?? []);

	const handleFriendClick = (friend: FriendInfoResponse) => {
		console.log("친구 클릭:", friend.name);
	};

	const handleFavoriteToggle = (friend: FriendInfoResponse) => {
		console.log("즐겨찾기 토글:", friend.name);
	};

	const favoriteFriends = friends.filter((f) => f.liked);
	const filteredFriends = friends.filter(
		(friend) =>
			searchTerm === "" ||
			friend.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

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
				<div className="p-4">
					<FriendSection
						title="즐겨찾기"
						friends={favoriteFriends}
						onFriendClick={handleFriendClick}
						onFavoriteToggle={handleFavoriteToggle}
					/>

					<FriendSection
						title="친구 목록"
						friends={filteredFriends}
						emptyMessage="친구가 없습니다"
						onFriendClick={handleFriendClick}
						onFavoriteToggle={handleFavoriteToggle}
					/>
				</div>
			</div>
		</>
	);
}

export default FriendLists;
