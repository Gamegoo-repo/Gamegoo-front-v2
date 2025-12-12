import { cn } from "@/shared/lib/utils";
import { getUserProfileBg } from "../lib/get-user-profile-bg";
import { getUserProfileSvg } from "../lib/get-user-profile-svg";

interface UserProfileProps {
	id: number;
	/**
	 * 컨테이너 크기 클래스
	 * @example "w-10 h-10"
	 * @example "w-10 h-10 mobile:w-20 mobile:h-20"
	 */
	sizeClass?: string;
	hasDropShadow?: boolean;
	className?: string;
}

export default function UserProfile({
	id,
	sizeClass = "w-10 h-10",
	hasDropShadow = false,
	className,
}: UserProfileProps) {
	const UserCharacterIcon = getUserProfileSvg(id);

	return (
		<div
			className={cn(
				"relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
				getUserProfileBg(id),
				sizeClass,
				className,
			)}
		>
			<UserCharacterIcon
				className={cn(
					"h-full w-full scale-[0.7]",
					hasDropShadow && "drop-shadow-[-4px_10px_10px_rgba(63,53,78,0.58)]",
				)}
			/>
		</div>
	);
}
