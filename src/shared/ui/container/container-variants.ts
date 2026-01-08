import { cva, type VariantProps } from "class-variance-authority";

export const containerVariants = cva(
	// base
	"w-full mx-auto",
	{
		variants: {
			// 최대 너비
			size: {
				sm: "max-w-[640px]",
				md: "max-w-[768px]",
				lg: "max-w-[1024px]",
				xl: "max-w-[1280px]",
				"2xl": "max-w-[1536px]",
				full: "max-w-full",
			},

			// 좌우 패딩
			padding: {
				none: "px-0",
				sm: "px-2",
				md: "px-4",
				lg: "px-6",
				xl: "px-8",
			},

			// 중앙 정렬
			centered: {
				true: "flex flex-col items-center",
				false: "",
			},
		},

		defaultVariants: {
			size: "xl",
			padding: "lg",
			centered: false,
		},
	},
);
