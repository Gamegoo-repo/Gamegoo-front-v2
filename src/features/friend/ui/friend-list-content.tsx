import type { FriendInfoResponse } from "@/shared/api";
import FriendSection from "./friend-section";

interface FriendListContentProps {
	hasNoFriends: boolean;
	favoriteFriends: FriendInfoResponse[];
	filteredFriends: FriendInfoResponse[];
	handleFriendClick: (friend: FriendInfoResponse) => void;
	handleFavoriteToggle: (friend: FriendInfoResponse) => void;
}

function FriendListContent({
	hasNoFriends,
	favoriteFriends,
	filteredFriends,
	handleFriendClick,
	handleFavoriteToggle,
}: FriendListContentProps) {
	if (hasNoFriends) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4 min-h-[400px]">
				<div className="text-center">
					<p className="text-gray-700 mb-2 regular-16">
						새로운 친구를 추가하고
					</p>
					<p className="text-gray-700 regular-16">함께 게임을 즐겨보세요!</p>
				</div>
			</div>
		);
	}

	return (
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
	);
}

export default FriendListContent;
