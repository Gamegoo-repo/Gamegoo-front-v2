import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/shared/lib/utils";
import { gridVariants } from "./gridVariants";
import { responsiveGridVariants } from "./responsiveGridVariants";
import type { GridProps } from "./grid.type";

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
	(
		{
			asChild = false,
			responsive = false,
			className,
			columns,
			gap,
			rowGap,
			columnGap,
			minWidth,
			fullWidth,
			...props
		},
		ref,
	) => {
		const Component = asChild ? Slot : "div";

		return (
			<Component
				ref={ref}
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
	},
);

Grid.displayName = "Grid";
