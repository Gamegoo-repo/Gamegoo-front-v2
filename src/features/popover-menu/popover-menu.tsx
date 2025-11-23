import React, { useCallback, useContext, useMemo } from "react";
import ThreeDotsButtonBlack from "@/shared/assets/icons/three_dots_button_black.svg?react";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { PopoverContext } from "@/shared/ui/popover/popover";
import type { PostDeleteMenuItem } from "../board/ui/post-delete-menu-item";
import type { PostEditMenuItem } from "../board/ui/post-edit-menu-item";
import type {
	BlockMenuItem,
	ChatroomLeaveMenuItem,
	FriendAddMenuItem,
	FriendDeleteMenuItem,
	ReportMenuItem,
} from "./menu-items";
import type { BlockToggleMenu } from "./menu-items/block-toggle-menu-item";

type MenuItemComponent =
	| typeof BlockMenuItem
	| typeof BlockToggleMenu
	| typeof ChatroomLeaveMenuItem
	| typeof FriendAddMenuItem
	| typeof FriendDeleteMenuItem
	| typeof ReportMenuItem
	| typeof PostDeleteMenuItem
	| typeof PostEditMenuItem;

interface PopoverMenuProps {
	menuItems: React.ReactElement<MenuItemComponent>[];
}

function PopoverMenu({ menuItems }: PopoverMenuProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"ghost"}
					className="w-5 h-5 mt-1 flex items-center justify-center p-0.5 hover:bg-gray-300 rounded transition-colors cursor-pointer"
					onClick={(e) => e.stopPropagation()}
				>
					<ThreeDotsButtonBlack />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				// side="right"
				// align="start"
				showArrow={false}
				className="w-48 p-0 bg-white rounded-[10px] shadow-lg"
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
			return React.cloneElement(menuItem, {
				...menuItem.props,
				onClosePopover: handleClose,
			} as React.ComponentProps<MenuItemComponent>);
		});
	}, [menuItems, handleClose]);

	if (menuItems.length === 0) return null;

	return (
		<div
			// onClick={(e) => e.stopPropagation()}
			className="[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-gray-200
  text-gray-600 medium-14"
		>
			{menuItemsWithCloseHandler}
		</div>
	);
}
