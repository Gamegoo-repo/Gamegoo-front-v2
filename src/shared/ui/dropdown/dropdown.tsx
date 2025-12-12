import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { useRef, useState } from "react";
import ArrowIcon from "@/shared/assets/icons/dropdown-arrow.svg?react";
import { cn } from "@/shared/lib/utils";
import { useClickOutside } from "@/shared/model/useClickOutside";

const dropdownVariants = cva(
	"flex items-center justify-between w-full border border-gray-300 bg-white text-gray-800 h-full mobile:rounded-[10px] rounded-md mobile:px-4 mobile:py-3 py-2 pr-2 pl-3 font-normal mobile:font-medium mobile:text-base text-[13px]",
	{
		variants: {
			variant: {
				primary: "",
				secondary: "",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
);

const dropdownMenuVariants = cva(
	"w-full h-auto shadow-md rounded-md mobile:rounded-[10px] transition-colors duration-200 ",
	{
		variants: {
			variant: {
				primary: "bg-gray-200",
				secondary: "bg-white",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
);

const dropdownItemVariants = cva(
	"relative flex w-full items-center mobile:px-4 px-3 mobile:py-3 py-2 mobile:font-medium mobile:text-base text-[13px] text-gray-800 leading-normal first:rounded-t-md last:rounded-b-md",
	{
		variants: {
			variant: {
				primary:
					"hover:text-white hover:bg-violet-600 active:text-white active:bg-violet-600",
				secondary:
					"hover:text-violet-600 hover:bg-gray-100 active:text-violet-600 active:bg-gray-100",
			},
		},
		defaultVariants: {
			variant: "primary",
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
	items: DropdownItem<T>[];
	onSelect: (id: T) => void;
	width?: string | number;
	height?: string | number;
}

export default function Dropdown<T>({
	selectedLabel,
	items,
	onSelect,
	variant = "primary",
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

	return (
		<div ref={menuRef} className={cn("relative", className)} {...restProps}>
			<button
				// id={"dropdown-button"}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls="dropdown-menu"
				type="button"
				className={dropdownVariants({ variant })}
				onClick={handleToggle}
			>
				{selectedLabel}
				<ArrowIcon
					className={cn(
						"mobile:w-4 w-3",
						"transition-all duration-300 ease-in-out",
						open && "rotate-180",
					)}
				/>
			</button>
			{open && (
				<div className="absolute top-full left-0 z-10 w-full">
					<div role="listbox" className={dropdownMenuVariants({ variant })}>
						{items.map((item) => (
							<button
								type="button"
								role="option"
								key={item.title}
								onClick={() => handleItemClick(item.id)}
								className={dropdownItemVariants({ variant })}
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
