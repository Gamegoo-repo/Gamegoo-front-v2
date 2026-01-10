import { cva } from "class-variance-authority";

export const gridVariants = cva("grid", {
	variants: {
		columns: {
			1: "grid-cols-1",
			2: "grid-cols-2",
			3: "grid-cols-3",
			4: "grid-cols-4",
			5: "grid-cols-5",
			6: "grid-cols-6",
			12: "grid-cols-12",
		},

		gap: {
			none: "gap-0",
			xs: "gap-1",
			sm: "gap-2",
			md: "gap-3",
			lg: "gap-4",
			xl: "gap-6",
			"2xl": "gap-8",
		},

		rowGap: {
			none: "gap-y-0",
			xs: "gap-y-1",
			sm: "gap-y-2",
			md: "gap-y-3",
			lg: "gap-y-4",
			xl: "gap-y-6",
			"2xl": "gap-y-8",
		},

		columnGap: {
			none: "gap-x-0",
			xs: "gap-x-1",
			sm: "gap-x-2",
			md: "gap-x-3",
			lg: "gap-x-4",
			xl: "gap-x-6",
			"2xl": "gap-x-8",
		},

		fullWidth: {
			true: "w-full",
			false: "",
		},
	},

	defaultVariants: {
		columns: 3,
		gap: "md",
		fullWidth: false,
	},
});
