import { forwardRef } from "react";
import type { ContainerProps } from "./container.type";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/shared/lib/utils";
import { containerVariants } from "./container-variants";

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
	({ className, size, padding, centered, asChild = false, ...props }, ref) => {
		const Component = asChild ? Slot : "div";

		return (
			<Component
				ref={ref}
				className={cn(
					containerVariants({ size, padding, centered }),
					className,
				)}
				{...props}
			/>
		);
	},
);

Container.displayName = "Container";
