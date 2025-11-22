import { cn } from "@/shared/lib/utils";

export type SkeletonVariant = "circular" | "rectangular" | "rounded" | "text";
export type SkeletonAnimation = "pulse" | "wave";

interface SkeletonProps {
	variant?: SkeletonVariant;
	width?: number | string;
	height?: number | string;
	animation?: SkeletonAnimation;
	className?: string;
	style?: React.CSSProperties;
}

export function Skeleton({
	variant = "text",
	width = 80,
	height = 16,
	animation = "wave",
	className,
	style,
}: SkeletonProps) {
	const variantClass: Record<SkeletonVariant, string> = {
		text: "rounded-full",
		rectangular: "rounded-none",
		rounded: "rounded-[12px]",
		circular: "rounded-full",
	};

	const animationClass: Record<SkeletonAnimation, string> = {
		pulse: "animate-skeleton-pulse",
		wave: "relative overflow-hidden before:absolute before:top-0 before:left-[-150%] before:w-[150%] before:h-full before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.6)] before:to-transparent before:animate-skeleton-wave",
	};

	const classNames = cn(
		"inline-block bg-gray-300",
		variantClass[variant],
		animationClass[animation],
		className,
	);

	const st: React.CSSProperties = {
		width: typeof width === "number" ? `${width}px` : width,
		height: typeof height === "number" ? `${height}px` : height,
		...style,
	};

	return <div className={classNames} style={st} />;
}
