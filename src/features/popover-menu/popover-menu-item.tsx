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
			className={`w-full px-5 py-3 medium-14 text-gray-600 hover:bg-gray-300 first:rounded-t-[10px] last:rounded-b-[10px]  cursor-pointer text-left transition-colors ${className}`}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{text}
		</button>
	);
}
