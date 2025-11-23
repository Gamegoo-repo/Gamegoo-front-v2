import { cn } from "@/shared/lib/utils";

export function Skeleton(props: {
	variant?: "circular" | "rectangular" | "rounded" | "text";
	width?: number | string;
	height?: number | string;
	animation?: "pulse" | "wave";
	style?: React.CSSProperties;
}) {
	const {
		variant = "text",
		width = 80,
		height = 16,
		animation = "wave",
		style,
	} = props;

	const variantClass = {
		text: "rounded-full",
		rectangular: "rounded-none",
		rounded: "rounded-[12px]",
		circular: "rounded-full",
	}[variant];

	const animationClass =
		animation === "pulse"
			? "animate-skeleton-pulse"
			: "relative overflow-hidden before:absolute before:top-0 before:left-[-150%] before:w-[150%] before:h-full before:content-[''] before:bg-gradient-to-r before:from-transparent before:via-[rgba(255,255,255,0.6)] before:to-transparent before:animate-skeleton-wave";

	const classNames = cn(
		"inline-block bg-[#dee2e6]",
		variantClass,
		animationClass,
	);
	const st = {
		width: typeof width === "number" ? `${width}px` : width,
		height: typeof height === "number" ? `${height}px` : height,
		...style,
	};

	return <div className={classNames} style={st} />;
}
