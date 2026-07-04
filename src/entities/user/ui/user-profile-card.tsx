import UserProfile from './user-profile';

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
        <span className="flex w-full items-center justify-start gap-1.5 text-base font-bold text-gray-800 mobile:text-xl">
          {gameName}
        </span>
        <span className="text-xs font-semibold text-gray-500 mobile:text-sm">#{tag}</span>
      </div>
    </div>
  );
}
