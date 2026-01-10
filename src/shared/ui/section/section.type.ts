import type { HTMLAttributes, ReactNode } from "react";
import type { ContainerSize } from "../container/container.type";

export type SectionPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type SectionBackground =
	| "transparent"
	| "white"
	| "gray"
	| "brand"
	| "dark"
	| "gradient";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode;

	/** 섹션 상하 패딩 */
	padding?: SectionPadding;

	/** 섹션 배경 */
	background?: SectionBackground;

	/** 섹션이 화면 전체 너비를 사용할지 여부 */
	fullWidth?: boolean;

	/** 내부 Container 최대 너비 */
	containerSize?: ContainerSize;

	/** Container 감싸지 않기 */
	noContainer?: boolean;
}
