import { cva } from "class-variance-authority";

export const sectionVariants = cva("w-full", {
	variants: {
		// 상하 패딩
		padding: {
			none: "py-0",
			xs: "py-8",
			sm: "py-12",
			md: "py-16",
			lg: "py-20",
			xl: "py-24",
		},

		// 배경
		background: {
			transparent: "bg-transparent",
			white: "bg-white",
			gray: "bg-gray-50",
			brand: "bg-brand-primary text-white",
			dark: "bg-gray-900 text-white",
			gradient:
				"bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 text-white",
		},

		// 전체 너비
		fullWidth: {
			true: "max-w-full",
			false: "",
		},
	},

	defaultVariants: {
		padding: "md",
		background: "transparent",
		fullWidth: false,
	},
});
