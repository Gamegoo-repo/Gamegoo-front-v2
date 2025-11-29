import UserProfile from "./user-profile";

export default function UserProfileCard({
	profileImage,
	gameName,
	tag,
}: {
	profileImage: number;
	gameName: string;
	tag: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<p className="relative">
				<UserProfile id={profileImage} size={74} hasDropShadow />
			</p>
			<div className="flex h-fit flex-col gap-1">
				<span className="bold-20 flex w-full items-center justify-start gap-1.5 text-gray-800">
					{gameName}
				</span>
				<span className="semibold-14 text-gray-500">#{tag}</span>
			</div>
		</div>
	);
}
