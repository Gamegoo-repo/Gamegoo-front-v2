import { toast } from "@/shared/lib/toast";
import { PopoverMenu, ReportMenuItem } from "../popover-menu";
import { BlockToggleMenu } from "../popover-menu/menu-items/block-toggle-menu-item";

export default function BlockMenu({
	userId,
	relationshipStatus,
}: {
	userId: number;
	relationshipStatus:
		| "stranger"
		| "blocked"
		| "pending-sent"
		| "pending-received"
		| "friend";
}) {
	const handleSuccess = () => {
		toast.confirm(
			relationshipStatus === "blocked"
				? "차단을 해제하였습니다."
				: "차단되었습니다.",
		);
	};

	const handleFailed = () => {
		toast.error("에러가 발생했습니다.");
	};

	return (
		<PopoverMenu
			menuItems={[
				<ReportMenuItem key={""} userId={userId} />,
				<BlockToggleMenu
					relationshipStatus={relationshipStatus}
					key={""}
					userId={userId}
					onSuccess={handleSuccess}
					onError={handleFailed}
				/>,
			]}
		/>
	);
}
