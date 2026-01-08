import type { HTMLAttributes, ReactNode } from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ContainerPadding = "none" | "sm" | "md" | "lg" | "xl";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	size?: ContainerSize;
	padding?: ContainerPadding;
	centered?: boolean;
	asChild?: boolean;
}
