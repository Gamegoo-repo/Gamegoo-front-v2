import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { useRef, useState } from "react";
import ArrowIcon from "@/shared/assets/icons/dropdown-arrow.svg?react";
import { cn } from "@/shared/lib/utils";
import { useClickOutside } from "@/shared/model/useClickOutside";

interface DropdownMenuProps<T> {
	selectedLabel: string;
	type?: "primary" | "secondary";
	defaultAction: (newState: T) => void;
	className?: string;
	items: {
		id: T;
		title: string;
		url?: T;
	}[];
}

const dropdownVariants = cva(
	"flex items-center justify-between border-1 border-gray-300 bg-white text-gray-800 w-full",
	{
		variants: {
			variant: {
				primary: "",
				secondary: "",
			},
			size: {
				sm: "px-2 py-1.5 text-xs h-8",
				md: "rounded-md px-2 pl-3 pr-2 text-[13px] h-10 md:p-4 md:text-base md:rounded-[10px] font-normal text-[13px] h-9", // mobile
				lg: "px-4 py-3 text-base rounded-[10px] font-medium text-base h-15", // desktop
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

const dropdownMenuVariants = cva("w-full h-auto shadow-md rounded-md", {
	variants: {
		variant: {
			primary: "bg-gray-200",
			secondary: "bg-white",
		},
		size: {
			sm: "rounded-md",
			md: "rounded-md md:rounded-[10px]",
			lg: "rounded-lg",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

const dropdownItemVariants = cva(
	"relative flex items-center w-full leading-normal first:rounded-t-md last:rounded-b-md",
	{
		variants: {
			variant: {
				primary: "hover:text-white hover:bg-violet-600",
				secondary: "hover:text-violet-600 hover:bg-gray-100",
			},
			size: {
				sm: "py-1.5 px-2 text-xs",
				md: "py-2.5 px-4 text-[13px] font-normal md:text-base md:font-medium",
				lg: "py-3 px-5 text-base",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

interface DropdownItem<T> {
	id: T;
	title: string;
	url?: string;
}

interface DropdownProps<T>
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">,
		VariantProps<typeof dropdownVariants> {
	selectedLabel: string;
	size: "sm" | "md" | "lg";
	items: DropdownItem<T>[];
	onSelect: (id: T) => void;
}

export default function Dropdown<T>({
	selectedLabel,
	items,
	onSelect,
	variant = "primary",
	size = "md",
	className,
	...restProps
}: DropdownProps<T>) {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);

	useClickOutside(menuRef, () => {
		if (open) setOpen(false);
	});

	const handleToggle = () => {
		setOpen((prev) => !prev);
	};

	const handleItemClick = (id: T) => {
		onSelect(id);
		setOpen(false);
	};

	const iconSizeClass = {
		sm: "w-2",
		md: "w-3",
		lg: "w-4",
	}[size];

	return (
		<div ref={menuRef} className={cn("relative", className)} {...restProps}>
			<button
				// id={"dropdown-button"}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls="dropdown-menu"
				type="button"
				className={dropdownVariants({ variant, size })}
				onClick={handleToggle}
			>
				{selectedLabel}
				<ArrowIcon
					className={cn(
						iconSizeClass,
						"transition-all duration-300 ease-in-out",
						open && "rotate-180",
					)}
				/>
			</button>
			{open && (
				<div className="absolute top-full left-0 z-10 w-full">
					<div
						role="listbox"
						className={dropdownMenuVariants({ variant, size })}
					>
						{items.map((item) => (
							<button
								type="button"
								role="option"
								key={item.title}
								onClick={() => handleItemClick(item.id)}
								className={dropdownItemVariants({ variant, size })}
							>
								{item.url ? (
									<Link
										to={"/board"}
										params={{}}
										className="w-full text-left"
										onClick={() => setOpen(false)}
									>
										{item.title}
									</Link>
								) : (
									<span className="w-full text-left">{item.title}</span>
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
