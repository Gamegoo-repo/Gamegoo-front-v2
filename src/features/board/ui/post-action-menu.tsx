import { PopoverMenu, ReportMenuItem } from "@/features/popover-menu";
import { BlockToggleMenu } from "@/features/popover-menu/menu-items/block-toggle-menu-item";
import { PostDeleteMenuItem } from "./post-delete-menu-item";
import { PostEditMenuItem } from "./post-edit-menu-item";

export default function PostActionMenu({
	postOwnerId,
	currentUserId,
	postId,
	isBlocked,
}: {
	postOwnerId: number;
	currentUserId: number;
	postId: number;
	isBlocked: boolean;
}) {
	const isOwner = postOwnerId === currentUserId;

	const handleSuccess = () => {
		alert("성공했습니다.");
	};

	const handleFailed = () => {
		alert("에러가 발생했습니다!.");
	};

	if (isOwner) {
		return (
			<PopoverMenu
				menuItems={[
					<PostEditMenuItem key={""} postId={postId} />,
					<PostDeleteMenuItem key={""} postId={postId} />,
				]}
			/>
		);
	} else {
		return (
			<PopoverMenu
				menuItems={[
					<ReportMenuItem key={""} userId={postOwnerId} />,
					<BlockToggleMenu
						relationshipStatus={isBlocked ? "blocked" : "stranger"}
						key={""}
						userId={postOwnerId}
						onSuccess={handleSuccess}
						onError={handleFailed}
					/>,
				]}
			/>
		);
	}
}
