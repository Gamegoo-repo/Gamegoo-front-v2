import { cva, type VariantProps } from "class-variance-authority";

export const responsiveGridVariants = cva("grid", {
	variants: {
		minWidth: {
			xs: "grid-cols-[repeat(auto-fit,minmax(150px,1fr))]",
			sm: "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
			md: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
			lg: "grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
			xl: "grid-cols-[repeat(auto-fit,minmax(400px,1fr))]",
		},

		gap: {
			none: "gap-0",
			xs: "gap-1",
			sm: "gap-2",
			md: "gap-4",
			lg: "gap-6",
			xl: "gap-8",
			"2xl": "gap-10",
		},
	},

	defaultVariants: {
		minWidth: "md",
		gap: "md",
	},
});
