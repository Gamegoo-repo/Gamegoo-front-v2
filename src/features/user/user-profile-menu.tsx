import UserProfile from "@/entities/user/ui/user-profile";
export default function UserProfileMenu({
	profileImage,
	name,
}: {
	profileImage: number;
	name: string;
}) {
	return (
		<div className="flex items-center gap-2">
			<UserProfile size={36} hasDropShadow={false} id={profileImage} />
			<button
				type="button"
				className="text-gray-800 semibold-16 flex items-center  gap-2"
			>
				{name}
				<img src="/assets/icons/menu/ic-menu.svg" alt="menu icon" />
			</button>
		</div>
	);
}
