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
			<DialogContent className="z-[110] w-[320px] gap-0 overflow-hidden rounded-[20px] border-none bg-white p-0 text-center shadow-[0_0_14.76px_0_rgba(0,0,0,0.15)]">
				<div className="flex min-h-[189px] items-center justify-center border-gray-300 border-b px-4 text-center font-normal text-[25px] text-gray-800">
					<div>
						<div className="mb-2">{title}</div>
						{description && (
							<div className="text-gray-500 text-sm">{description}</div>
						)}
					</div>
				</div>
				<div className="flex items-center justify-center">
					<button
						type="button"
						onClick={onConfirm}
						disabled={disabled || isLoading}
						className="h-[79px] flex-1 rounded-bl-[20px] text-center font-semibold text-gray-700 text-lg hover:bg-gray-100 hover:text-violet-600 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300"
					>
						{isLoading ? "처리 중..." : confirmText}
					</button>
					<button
						type="button"
						onClick={handleCancel}
						className="h-[79px] flex-1 rounded-br-[20px] text-center font-semibold text-gray-700 text-lg hover:bg-gray-100 hover:text-violet-600"
					>
						{cancelText}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
