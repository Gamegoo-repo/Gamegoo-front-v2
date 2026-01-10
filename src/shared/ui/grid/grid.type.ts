import type {
	ComponentPropsWithoutRef,
	CSSProperties,
	ElementType,
	ReactNode,
} from "react";

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type GridMinWidth = "xs" | "sm" | "md" | "lg" | "xl";
type PolymorphicProps<T extends ElementType> = {
	as?: T;
	children: ReactNode;
	columns?: GridColumns;
	gap?: GridGap;
	rowGap?: GridGap;
	columnGap?: GridGap;
	responsive?: boolean;
	minWidth?: GridMinWidth;
	fullWidth?: boolean;
	className?: string;
	style?: CSSProperties;
} & Omit<
	ComponentPropsWithoutRef<T>,
	"children" | "as" | "className" | "style"
>;

export type GridProps<T extends ElementType = "div"> = PolymorphicProps<T>;
