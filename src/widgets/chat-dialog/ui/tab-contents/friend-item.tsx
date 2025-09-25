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
			className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer w-full text-left"
			onClick={handleFriendClick}
			onKeyDown={handleKeyDown}
		>
			<div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center text-white font-medium">
				{friend.name?.[0] || "?"}
			</div>
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
