import type { HTMLAttributes, ReactNode } from "react";

export type FlexDirection = "row" | "column" | "rowReverse" | "columnReverse";
export type FlexJustify =
	| "start"
	| "center"
	| "end"
	| "between"
	| "around"
	| "evenly";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexGap =
	| "none"
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl"
	| "4xl";
export type FlexWrap = "nowrap" | "wrap" | "wrapReverse";

export interface FlexBoxProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	direction?: FlexDirection;
	justify?: FlexJustify;
	align?: FlexAlign;
	gap?: FlexGap;
	wrap?: FlexWrap;
	fullWidth?: boolean;
	fullHeight?: boolean;
	asChild?: boolean;
}
