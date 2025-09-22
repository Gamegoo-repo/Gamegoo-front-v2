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
	onFavoriteToggle 
}: FriendSectionProps) {
	return (
		<div className="mb-6">
			<h3 className="text-sm regular-11 text-gray-500 mb-3">{title}</h3>
			<div className="space-y-2">
				{friends.length > 0 ? (
					friends.map((friend) => (
						<FriendItem
							key={friend.memberId}
							friend={friend}
							onFriendClick={onFriendClick}
							onFavoriteToggle={onFavoriteToggle}
						/>
					))
				) : (
					emptyMessage && (
						<div className="p-4 text-center text-gray-400 text-sm">
							{emptyMessage}
						</div>
					)
				)}
			</div>
		</div>
	);
}

export default FriendSection;