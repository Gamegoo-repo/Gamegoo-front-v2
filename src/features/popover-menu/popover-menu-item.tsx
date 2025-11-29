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
			className={`medium-14 w-full cursor-pointer px-5 py-3 text-left text-gray-600 transition-colors first:rounded-t-[10px] last:rounded-b-[10px] hover:bg-gray-300 ${className}`}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{text}
		</button>
	);
}
