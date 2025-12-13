import { cn } from "@/shared/lib/utils";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

interface CardProps<T extends ElementType = "div"> {
	/** 렌더링할 HTML 태그 또는 컴포넌트 */
	as?: T;
	/** 자식 요소 */
	children: ReactNode;
	/** 추가 클래스명 */
	className?: string;
	/** Card의 패딩 크기 */
	padding?: "none" | "sm" | "md" | "lg";
	/** Card의 rounded 크기 */
	rounded?: "none" | "sm" | "md" | "lg" | "xl";
	/** 그림자 효과 */
	shadow?: "none" | "sm" | "md" | "lg";
	/** 호버 효과 여부 */
	hoverable?: boolean;
}

type PolymorphicCardProps<T extends ElementType = "div"> = CardProps<T> &
	Omit<ComponentPropsWithoutRef<T>, keyof CardProps<T>>;

const paddingStyles = {
	none: "",
	sm: "p-2 mobile:p-4",
	md: "p-5 mobile:p-6",
	lg: "px-5 py-2 mobile:px-11 mobile:py-4",
};

const roundedStyles = {
	none: "",
	sm: "rounded",
	md: "rounded-md mobile:rounded-lg",
	lg: "rounded-lg mobile:rounded-[10px]",
	xl: "rounded-xl mobile:rounded-2xl",
};

const shadowStyles = {
	none: "",
	sm: "shadow-sm",
	md: "shadow-md",
	lg: "shadow-lg",
};

export function Card<T extends ElementType = "div">({
	as,
	children,
	className,
	padding = "md",
	rounded = "md",
	shadow = "none",
	hoverable = false,
	...props
}: PolymorphicCardProps<T>) {
	const Component = as || "div";

	return (
		<Component
			className={cn(
				"bg-white",
				paddingStyles[padding],
				roundedStyles[rounded],
				shadowStyles[shadow],
				hoverable && "transition-shadow hover:shadow-lg",
				className,
			)}
			{...props}
		>
			{children}
		</Component>
	);
}
