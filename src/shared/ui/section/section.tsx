import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { sectionVariants } from "./sectionVariants";
import type { SectionProps } from "./section.type";
import { Container } from "../container";

export const Section = React.forwardRef<HTMLElement, SectionProps>(
	(
		{
			children,
			padding = "md",
			background = "transparent",
			fullWidth = false,
			containerSize = "xl",
			noContainer = false,
			className,
			...rest
		},
		ref,
	) => {
		const content = noContainer ? (
			children
		) : (
			<Container size={containerSize}>{children}</Container>
		);

		return (
			<section
				ref={ref}
				className={cn(
					sectionVariants({ padding, background, fullWidth }),
					className,
				)}
				{...rest}
			>
				{content}
			</section>
		);
	},
);

Section.displayName = "Section";
