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
		<div className="flex gap-3 items-center">
			<p className="relative">
				<UserProfile id={profileImage} size={74} hasDropShadow />
			</p>
			<div className="flex flex-col h-fit gap-1">
				<span className="flex items-center justify-start gap-1.5 text-gray-800 bold-20 w-full">
					{gameName}
				</span>
				<span className="text-gray-500 semibold-14">#{tag}</span>
			</div>
		</div>
	);
}
