import { usePostDetail } from "@/entities/post/model/use-post-detail";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import PostFormModal, { type BoardFormData } from "./post-form-modal";
import { toast } from "@/shared/lib/toast";

type PostFormModalContainerProps =
	| {
			isOpen: boolean;
			onClose: () => void;
			mode: "create";
	  }
	| {
			isOpen: boolean;
			onClose: () => void;
			mode: "edit";
			postId: number; // edit일 때는 필수!
	  };

export default function PostFormModalContainer(
	props: PostFormModalContainerProps,
) {
	const { isOpen, onClose, mode } = props;

	const postId = mode === "edit" ? props.postId : undefined;

	const {
		isPending: isPendingUserInfo,
		data: userInfo,
		isError: isUserError,
	} = useFetchMyInfo();

	const {
		isPending: isPendingPostData,
		data: postData,
		isError: isPostError,
	} = usePostDetail(postId ?? 0, mode === "edit" && !!postId);

	if (!isOpen) return null;

	const isLoading = isPendingUserInfo || (mode === "edit" && isPendingPostData);

	if (isLoading) {
		return null;
	}

	if (isUserError || !userInfo) {
		return null;
	}

	// edit 모드에서 postData 에러 처리
	if (mode === "edit" && (isPostError || !postData)) {
		toast.error("게시글 정보를 불러오지 못했습니다.");
		onClose();
		return null;
	}

	return (
		<PostFormModal
			isOpen={isOpen}
			onClose={onClose}
			mode={mode}
			postToEdit={mode === "edit" ? (postData as BoardFormData) : undefined}
			userInfo={userInfo}
		/>
	);
}
