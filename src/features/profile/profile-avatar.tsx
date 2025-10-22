interface ProfileAvatarProps {
	size: "sm" | "md" | "lg" | "xl";
	profileIndex?: number;
}

const WRAPPER_SIZE = {
	sm: "w-[45px] h-[45px]",
	md: "w-16 h-16",
	lg: "w-20 h-20",
	xl: "w-[144px] h-[144px]",
} as const;

const IMAGE_SIZE = {
	sm: "w-[33px] h-[33px]",
	md: "w-12 h-12",
	lg: "w-16 h-16",
	xl: "w-[100px] h-[100px]",
} as const;

const BACKGROUND_COLOR = [
	"#DFDEFF",
	"#FAF9FF",
	"#9F90F9",
	"#FAF9FF",
	"#FAF9FF",
	"#9F90F9",
	"#FAF9FF",
	"#DFDEFF",
] as const;

const ProfileAvatar = ({ size, profileIndex = 0 }: ProfileAvatarProps) => {
	return (
		<div
			className={`${WRAPPER_SIZE[size]} relative rounded-full`}
			style={{
				backgroundColor: BACKGROUND_COLOR[profileIndex ? profileIndex - 1 : 0],
			}}
		>
			<img
				src={
					profileIndex === 0
						? "/profile/profile_default.svg"
						: `/profile/profile${profileIndex}.svg`
				}
				alt={`Profile ${profileIndex}`}
				className={`${IMAGE_SIZE[size]} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none`}
			/>
		</div>
	);
};

export default ProfileAvatar;
