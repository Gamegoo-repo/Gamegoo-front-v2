import { Link } from "@tanstack/react-router";
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

export default function Dropdown<T>({
	selectedLabel,
	items,
	defaultAction,
	type = "primary",
	className,
	...restProps
}: DropdownMenuProps<T> & React.HTMLAttributes<HTMLDivElement>) {
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [open, setOpen] = useState(false);

	useClickOutside(menuRef, () => {
		if (open) setOpen(false);
	});

	const handleToggle = () => {
		setOpen((prev) => !prev);
	};

	const handleItemClick = (id: T) => {
		defaultAction(id);
		setOpen(false);
	};

	return (
		<div
			ref={menuRef}
			className={cn("w-[138px] relative", className)}
			{...restProps}
		>
			<button
				// id={"dropdown-button"}
				aria-haspopup="listbox"
				aria-expanded={open}
				aria-controls="dropdown-menu"
				type="button"
				className="inline-flex items-center justify-between p-4 rounded-[10px] border-1 border-gray-300 bg-white h-full medium-16 w-full text-gray-800"
				onClick={handleToggle}
			>
				{selectedLabel}
				<ArrowIcon
					className={cn(
						"transition-all duration-300 ease-in-out",
						open && "rotate-180",
					)}
				/>
			</button>
			{open && (
				<div className="absolute left-0 top-full w-full">
					<div
						role="listbox"
						className={cn(
							"w-full h-auto shadow-md rounded-[10px] bg-gray-200 text-gray-800",
							type === "primary" && "bg-gray-200",
							type === "secondary" && "bg-white",
						)}
					>
						{items.map((item) => (
							<button
								type="button"
								role="option"
								key={item.title}
								onClick={() => handleItemClick(item.id)}
								className={cn(
									type === "primary" &&
										`relative flex items-center medium-16 w-full hover:text-white hover:bg-violet-600 py-2.5 px-4 leading-normal first:rounded-t-[10px] last:rounded-b-[10px]`,
									type === "secondary" &&
										`relative flex items-center medium-16 w-full hover:text-violet-600 hover:bg-gray-100 py-2.5 px-4 leading-normal first:rounded-t-[10px] last:rounded-b-[10px]`,
								)}
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
