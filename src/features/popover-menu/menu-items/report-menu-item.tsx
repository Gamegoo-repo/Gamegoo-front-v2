import type { ReportPath } from "@/shared/api/@generated";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";
import { useReportModalStore } from "@/features/report/model/use-report-modal-store";

interface ReportMenuItemProps {
	userId: number;
	reportType: ReportPath;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	boardId?: number;
	onClosePopover?: () => void;
}

export function ReportMenuItem({
	userId,
	reportType,
	onSuccess,
	onError,
	className,
	onClosePopover,
	boardId,
}: ReportMenuItemProps) {
	const { openModal: openReportModal } = useReportModalStore();

	const menuItemProps: PopoverMenuItemProps = {
		text: "신고하기",
		onClick: () => {
			openReportModal(reportType, userId, boardId);
			onClosePopover?.();
		},
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
