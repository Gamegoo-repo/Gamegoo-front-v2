import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { GridItemProps } from "./grid-item.type";
import { cn } from "@/shared/lib/utils";

export const GridItem = <T extends React.ElementType = "div">({
	as,
	colSpan,
	rowSpan,
	className,
	style,
	...props
}: GridItemProps<T>) => {
	const Comp = as ? Slot : "div";

	return (
		<Comp
			className={cn(className)}
			style={{
				...style,
				...(colSpan && { gridColumn: `span ${colSpan}` }),
				...(rowSpan && { gridRow: `span ${rowSpan}` }),
			}}
			{...props}
		/>
	);
};
