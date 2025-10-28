import { cn } from "@/shared/lib/utils";
import { getUserProfileBg } from "../lib/get-user-profile-bg";
import { getUserProfileSvg } from "../lib/get-user-profile-svg";

export default function UserProfile({
	id,
	size = 40,
}: {
	id: number;
	size?: number;
}) {
	const UserCharacterIcon = getUserProfileSvg(id);
	return (
		<div
			className={cn(
				"rounded-full flex items-center justify-center shrink-0",
				getUserProfileBg(id),
			)}
			style={{
				width: `${size}px`,
				height: `${size}px`,
			}}
		>
			<UserCharacterIcon
				style={{
					height: `${size * 0.75}px`,
				}}
			/>
		</div>
	);
}
