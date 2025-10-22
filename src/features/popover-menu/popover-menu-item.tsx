export interface PopoverMenuItemProps {
	text: string;
	onClick: () => void;
	className?: string;
}

export function PopoverMenuItem({
	text,
	onClick,
	className = "",
}: PopoverMenuItemProps) {
	return (
		<button
			type="button"
			className={`w-full px-4 py-3 text-sm text-gray-900 hover:bg-gray-50 cursor-pointer text-left transition-colors ${className}`}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{text}
		</button>
	);
}
