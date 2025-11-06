import CloseIcon from "@/shared/assets/icons/ic-close.svg?react";
import { cn } from "@/shared/lib/utils";

export default function CloseButton({
	onClose,
	className,
	iconClass,
}: {
	onClose: () => void;
	className?: string;
	iconClass?: string;
}) {
	return (
		<button
			type="button"
			onClick={onClose}
			className={cn("p-1.5 cursor-pointer text-gray-800", className)}
		>
			<CloseIcon className={iconClass} />
		</button>
	);
}
