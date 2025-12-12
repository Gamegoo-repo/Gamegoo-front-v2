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
		<div className="flex items-center gap-2 mobile:gap-3">
			<p className="relative">
				<UserProfile
					id={profileImage}
					sizeClass="w-12 h-12 mobile:w-[74px] mobile:h-[74px]"
					hasDropShadow
				/>
			</p>
			<div className="flex h-fit flex-col gap-1">
				<span className="flex w-full items-center justify-start gap-1.5 font-bold mobile:text-xl text-base text-gray-800">
					{gameName}
				</span>
				<span className="font-semibold mobile:text-sm text-gray-500 text-xs">
					#{tag}
				</span>
			</div>
		</div>
	);
}
