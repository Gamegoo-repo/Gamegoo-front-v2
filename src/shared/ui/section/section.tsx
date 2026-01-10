import * as React from "react";
import { cn } from "../../lib/utils";
import { sectionVariants } from "./sectionVariants";
import type { SectionProps } from "./section.type";
import { Container } from "../container";

export const Section = ({
	children,
	padding = "md",
	background = "transparent",
	fullWidth = false,
	containerSize = "xl",
	noContainer = false,
	className,
	...rest
}: SectionProps) => {
	const content = noContainer ? (
		children
	) : (
		<Container size={containerSize}>{children}</Container>
	);

	return (
		<section
			className={cn(
				sectionVariants({ padding, background, fullWidth }),
				className,
			)}
			{...rest}
		>
			{content}
		</section>
	);
};
