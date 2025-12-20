import React, { useCallback, useContext, useMemo } from "react";
import ThreeDotsButtonBlack from "@/shared/assets/icons/three_dots_button_black.svg?react";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { PopoverContext } from "@/shared/ui/popover/popover";

interface PopoverMenuProps {
	menuItems: React.ReactElement[];
	align?: "start" | "center" | "end";
	contentClassName?: string;
}

function PopoverMenu({
	menuItems,
	align = "end",
	contentClassName,
}: PopoverMenuProps) {
	return (
		<Popover align={align}>
			<PopoverTrigger asChild>
				<Button
					variant={"ghost"}
					className="mt-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded p-0.5 transition-colors hover:bg-gray-300"
					onClick={(e) => e.stopPropagation()}
				>
					<ThreeDotsButtonBlack />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				showArrow={false}
				className={`w-48 rounded-[10px] bg-white p-0 shadow-lg ${contentClassName || ""}`}
			>
				<PopoverMenuContent menuItems={menuItems} />
			</PopoverContent>
		</Popover>
	);
}

export default PopoverMenu;

function PopoverMenuContent({ menuItems }: PopoverMenuProps) {
	const context = useContext(PopoverContext);

	const handleClose = useCallback(() => {
		context?.close();
	}, [context]);

	const menuItemsWithCloseHandler = useMemo(() => {
		return menuItems.map((menuItem) => {
			return React.cloneElement(
				menuItem as React.ReactElement<Record<string, unknown>>,
				{
					...(menuItem.props as Record<string, unknown>),
					onClosePopover: handleClose,
				} as Record<string, unknown>,
			);
		});
	}, [menuItems, handleClose]);

	if (menuItems.length === 0) return null;

	return (
		<div className="medium-14 text-gray-600 [&>*:not(:last-child)]:border-gray-200 [&>*:not(:last-child)]:border-b">
			{menuItemsWithCloseHandler}
		</div>
	);
}
