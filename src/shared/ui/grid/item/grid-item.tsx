import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/shared/lib/utils";
import type { GridItemProps } from "./grid-item.type";

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
	({ asChild = false, colSpan, rowSpan, className, style, ...props }, ref) => {
		const Component = asChild ? Slot : "div";

		return (
			<Component
				ref={ref}
				className={cn(className)}
				style={{
					...style,
					...(colSpan && { gridColumn: `span ${colSpan}` }),
					...(rowSpan && { gridRow: `span ${rowSpan}` }),
				}}
				{...props}
			/>
		);
	},
);

GridItem.displayName = "GridItem";
