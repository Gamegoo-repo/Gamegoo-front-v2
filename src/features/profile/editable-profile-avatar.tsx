import { useFetchUserInfo } from "@/entities/user/api/use-fetch-user-info";
import UserProfile from "@/entities/user/ui/user-profile";
import PencilIcon from "@/shared/assets/icons/pencil.svg?react";

function EditableProfileAvatar() {
	const { data: userInfo } = useFetchUserInfo();

	return (
		<div>
			<div className="relative">
				<UserProfile id={userInfo?.profileImg ?? 0} size={186} />
				<div className="absolute bottom-0 left-0 w-[56px] h-[56px] bg-gray-800/75 rounded-full flex items-center justify-center">
					<PencilIcon className="w-[56px] h-[56px]" />
				</div>
			</div>
		</div>
	);
}

export default EditableProfileAvatar;
