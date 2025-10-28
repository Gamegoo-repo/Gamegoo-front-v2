import React, { type ReactElement, type ReactNode, useContext } from "react";
import { PopoverContext } from "./popover";

interface PopoverTriggerProps {
	children: ReactNode;

	asChild?: boolean;
}

export function PopoverTrigger({
	children,
	asChild = false,
}: PopoverTriggerProps) {
	const context = useContext(PopoverContext);

	if (!context) {
		throw new Error("PopoverTrigger must be used within a Popover");
	}

	const { open, isOpen, close, triggerRef } = context;

	if (asChild && React.isValidElement(children)) {
		const childProps = children.props as any;

		// asChild가 true인 경우
		return React.cloneElement(children as ReactElement<any>, {
			ref: triggerRef,
			onClick: (e: React.MouseEvent) => {
				e.preventDefault();

				if (childProps.onClick) {
					childProps.onClick(e);
				}
				isOpen ? close() : open();
			},
		});
	}

	// asChild가 false인 경우
	return (
		<button
			ref={triggerRef as React.RefObject<HTMLButtonElement>}
			onClick={open}
			type="button"
		>
			{children}
		</button>
	);
}
