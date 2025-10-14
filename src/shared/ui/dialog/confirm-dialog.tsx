import { Dialog, DialogContent } from "./dialog";

interface ConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	confirmText: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel?: () => void;
	isLoading?: boolean;
	disabled?: boolean;
}

export function ConfirmDialog({
	isOpen,
	onOpenChange,
	title,
	description,
	confirmText,
	cancelText = "취소",
	onConfirm,
	onCancel,
	isLoading = false,
	disabled = false,
}: ConfirmDialogProps) {
	const handleCancel = () => {
		onCancel?.();
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="gap-0 text-center z-[110] p-0 w-[320px] bg-white rounded-[20px] shadow-[0_0_14.76px_0_rgba(0,0,0,0.15)] overflow-hidden border-none">
				<div className="min-h-[189px] flex items-center justify-center text-center border-b border-gray-300 text-[25px] font-normal text-gray-800 px-4">
					<div>
						<div className="mb-2">{title}</div>
						{description && (
							<div className="text-sm text-gray-500">{description}</div>
						)}
					</div>
				</div>
				<div className="flex items-center justify-center">
					<button
						type="button"
						onClick={onConfirm}
						disabled={disabled || isLoading}
						className="flex-1 h-[79px] text-center font-semibold text-lg text-gray-700 hover:text-violet-600 hover:bg-gray-100 rounded-bl-[20px] disabled:text-gray-300 disabled:hover:text-gray-300 disabled:hover:bg-transparent"
					>
						{isLoading ? "처리 중..." : confirmText}
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="flex-1 h-[79px] text-center font-semibold text-lg text-gray-700 hover:text-violet-600 hover:bg-gray-100 rounded-br-[20px]"
					>
						{cancelText}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
