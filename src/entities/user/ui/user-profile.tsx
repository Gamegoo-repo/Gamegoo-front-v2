import { cn } from "@/shared/lib/utils";
import { getUserProfileBg } from "../lib/get-user-profile-bg";
import { getUserProfileSvg } from "../lib/get-user-profile-svg";

export default function UserProfile({
	id,
	size = 40,
	hasDropShadow = false,
}: {
	id: number;
	size?: number;
	hasDropShadow: boolean;
}) {
	const UserCharacterIcon = getUserProfileSvg(id);
	const profileImageSize = Math.round(size * 0.7);
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center overflow-hidden rounded-full",
				getUserProfileBg(id),
			)}
			style={{
				width: `${size}px`,
				height: `${size}px`,
			}}
		>
			<UserCharacterIcon
				className={`${hasDropShadow && "drop-shadow-[-4px_10px_10px_rgba(63,53,78,0.58)]"}`}
				style={{
					width: `${profileImageSize}px`,
					height: `${profileImageSize}px`,
				}}
			/>
		</div>
	);
}
