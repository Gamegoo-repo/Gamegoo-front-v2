import React, { useCallback, useMemo, useState } from "react";
import ThreeDotsButtonBlack from "@/shared/assets/icons/three_dots_button_black.svg?react";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type {
	BlockMenuItem,
	ChatroomLeaveMenuItem,
	FriendAddMenuItem,
	FriendDeleteMenuItem,
	ReportMenuItem,
} from "./menu-items";

type MenuItemComponent =
	| typeof BlockMenuItem
	| typeof ChatroomLeaveMenuItem
	| typeof FriendAddMenuItem
	| typeof FriendDeleteMenuItem
	| typeof ReportMenuItem;

interface PopoverMenuProps {
	menuItems: React.ReactElement<MenuItemComponent>[];
}

function PopoverMenu({ menuItems }: PopoverMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	const menuItemsWithCloseHandler = useMemo(() => {
		return menuItems.map((menuItem) => {
			return React.cloneElement(menuItem, {
				...menuItem.props,
				onClosePopover: handleClose,
			} as React.ComponentProps<MenuItemComponent>);
		});
	}, [menuItems, handleClose]);

	if (menuItems.length === 0) return null;

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					className="w-5 h-5 mt-1 flex items-center justify-center p-0.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
					onClick={(e) => e.stopPropagation()}
				>
					<ThreeDotsButtonBlack />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				align="start"
				className="w-48 p-0 bg-white rounded-lg shadow-lg border border-gray-200"
			>
				<div className="py-[2px] [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-gray-100">
					{menuItemsWithCloseHandler}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default PopoverMenu;
