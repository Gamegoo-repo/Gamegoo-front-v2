import { usePostDetail } from "@/entities/post/model/use-post-detail";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { toast } from "@/shared/lib/toast";
import PostFormModal, { type BoardFormData } from "./post-form/post-form-modal";

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

	if (mode === "edit" && (isPostError || !postData)) {
		toast.error("게시글 정보를 불러오지 못했습니다.");
		return null;
	}

	if (mode === "create") {
		return (
			<PostFormModal
				isOpen={isOpen}
				onClose={onClose}
				mode="create"
				userInfo={userInfo}
			/>
		);
	}

	return (
		<PostFormModal
			isOpen={isOpen}
			onClose={onClose}
			mode="edit"
			postId={props.postId}
			postToEdit={postData as BoardFormData}
			userInfo={userInfo}
		/>
	);
}
