import type { FriendInfoResponse } from "@/shared/api";
import FriendItem from "./friend-item";

interface FriendSectionProps {
	title: string;
	friends: FriendInfoResponse[];
	emptyMessage?: string;
	onFriendClick?: (friend: FriendInfoResponse) => void;
	onFavoriteToggle?: (friend: FriendInfoResponse) => void;
}

function FriendSection({
	title,
	friends,
	emptyMessage,
	onFriendClick,
	onFavoriteToggle,
}: FriendSectionProps) {
	const renderFriendItems = () => {
		if (friends.length > 0) {
			return friends.map((friend) => (
				<ul key={friend.memberId}>
					<FriendItem
						friend={friend}
						onFriendClick={onFriendClick}
						onFavoriteToggle={onFavoriteToggle}
					/>
				</ul>
			));
		}

		if (emptyMessage) {
			return (
				<div className="p-4 text-center text-gray-400 text-sm">
					{emptyMessage}
				</div>
			);
		}
	};

	if (!emptyMessage && friends.length === 0) {
		return null;
	}

	return (
		<div className="mb-6">
			<h3 className="regular-11 mb-3 text-gray-500 text-sm">{title}</h3>
			<div className="space-y-2">{renderFriendItems()}</div>
		</div>
	);
}

export default FriendSection;
