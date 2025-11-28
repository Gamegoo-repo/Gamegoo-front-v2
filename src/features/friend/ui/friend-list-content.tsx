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
			<div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-16">
				<div className="text-center">
					<p className="regular-16 mb-2 text-gray-700">
						새로운 친구를 추가하고
					</p>
					<p className="regular-16 text-gray-700">함께 게임을 즐겨보세요!</p>
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
