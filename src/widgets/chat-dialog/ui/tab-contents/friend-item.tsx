import ProfileAvatar from "@/features/profile/profile-avatar";
import type { FriendInfoResponse } from "@/shared/api";
import StarIcon from "@/shared/assets/icons/star.svg?react";
import StarVioletIcon from "@/shared/assets/icons/star_violet.svg?react";

interface FriendItemProps {
	friend: FriendInfoResponse;
	showFavoriteAction?: boolean;
	onFriendClick?: (friend: FriendInfoResponse) => void;
	onFavoriteToggle?: (friend: FriendInfoResponse) => void;
}

function FriendItem({
	friend,
	showFavoriteAction = true,
	onFriendClick,
	onFavoriteToggle,
}: FriendItemProps) {
	const handleFriendClick = () => {
		onFriendClick?.(friend);
	};

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onFavoriteToggle?.(friend);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleFriendClick();
		}
	};

	const handleFavoriteKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			e.stopPropagation();
			onFavoriteToggle?.(friend);
		}
	};

	return (
		<button
			type="button"
			className="flex items-center cursor-pointer w-full text-left"
			onClick={handleFriendClick}
			onKeyDown={handleKeyDown}
		>
			<ProfileAvatar size="sm" profileIndex={friend.profileImg} />
			<div className="ml-3 flex-1">
				<p className="font-medium text-gray-900">{friend.name}</p>
				{friend.blind && <p className="text-sm text-gray-400">차단됨</p>}
			</div>
			{showFavoriteAction && (
				<button
					type="button"
					className={`${friend.liked ? "text-yellow-500" : "text-gray-400"} hover:text-yellow-500`}
					onClick={handleFavoriteClick}
					onKeyDown={handleFavoriteKeyDown}
					aria-label="즐겨찾기 토글"
				>
					{friend.liked ? <StarVioletIcon /> : <StarIcon />}
				</button>
			)}
		</button>
	);
}

export default FriendItem;
