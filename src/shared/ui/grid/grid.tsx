import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";
import { gridVariants } from "./gridVariants";
import { responsiveGridVariants } from "./responsiveGridVariants";
import type { GridProps } from "./grid.type";

export const Grid = <T extends React.ElementType = "div">({
	as,
	responsive = false,
	className,
	columns,
	gap,
	rowGap,
	columnGap,
	minWidth,
	fullWidth,
	...props
}: GridProps<T>) => {
	const Comp = as ? Slot : "div";

	return (
		<Comp
			className={cn(
				responsive
					? responsiveGridVariants({ minWidth, gap })
					: gridVariants({
							columns,
							gap,
							rowGap,
							columnGap,
							fullWidth,
						}),
				className,
			)}
			{...props}
		/>
	);
};
