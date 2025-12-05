import { PopoverMenu, ReportMenuItem } from "@/features/popover-menu";
import { BlockToggleMenu } from "@/features/popover-menu/menu-items/block-toggle-menu-item";
import { PostDeleteMenuItem } from "./post-delete-menu-item";
import { PostEditMenuItem } from "./post-edit-menu-item";
import { toast } from "@/shared/lib/toast";

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
		toast.confirm(isBlocked ? "차단을 해제하였습니다." : "차단되었습니다.");
	};

	const handleFailed = () => {
		toast.error("에러가 발생했습니다.");
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
