import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api";
import type { ReportPath, ReportRequest } from "@/shared/api/@generated";
import { useConfirmDialog } from "@/shared/providers";
import {
	PopoverMenuItem,
	type PopoverMenuItemProps,
} from "../popover-menu-item";

interface ReportMenuItemProps {
	userId: number;
	reportType?: ReportPath;
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	className?: string;
	onClosePopover?: () => void;
}

export function ReportMenuItem({
	userId,
	reportType = "PROFILE",
	onSuccess,
	onError,
	className,
	onClosePopover,
}: ReportMenuItemProps) {
	const { showConfirmDialog } = useConfirmDialog();

	const reportUserMutation = useMutation({
		mutationFn: async ({
			targetUserId,
			reportRequest,
		}: {
			targetUserId: number;
			reportRequest: ReportRequest;
		}) => {
			const response = await api.report.addReport(targetUserId, reportRequest);
			return response.data;
		},
		onSuccess: () => {
			onSuccess?.();
		},
		onError: (error) => {
			onError?.(error);
		},
	});

	const handleReportUser = () => {
		onClosePopover?.();
		showConfirmDialog({
			title: "이 사용자를 신고하시겠습니까?",
			description: "신고된 내용은 검토 후 조치됩니다.",
			confirmText: "신고",
			onConfirm: () => {
				const reportRequest: ReportRequest = {
					reportCodeList: [1], // 스팸으로 기본 설정, TODO: 사용자가 선택할 수 있도록 개선
					contents: "부적절한 행동", // TODO: 사용자가 입력할 수 있도록 개선
					pathCode: reportType === "CHAT" ? 1 : reportType === "BOARD" ? 2 : 3, // CHAT=1, BOARD=2, PROFILE=3
				};
				reportUserMutation.mutate({ targetUserId: userId, reportRequest });
			},
		});
	};

	const menuItemProps: PopoverMenuItemProps = {
		text: "신고하기",
		onClick: handleReportUser,
		className,
	};

	return <PopoverMenuItem {...menuItemProps} />;
}
