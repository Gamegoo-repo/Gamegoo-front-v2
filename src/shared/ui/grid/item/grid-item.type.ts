import type {
	ComponentPropsWithoutRef,
	CSSProperties,
	ElementType,
	ReactNode,
} from "react";

export type GridItemProps<T extends ElementType = "div"> = {
	as?: T;
	asChild?: boolean;
	children?: ReactNode;
	colSpan?: number;
	rowSpan?: number;
	className?: string;
	style?: CSSProperties;
} & Omit<
	ComponentPropsWithoutRef<T>,
	"children" | "as" | "className" | "style"
>;
