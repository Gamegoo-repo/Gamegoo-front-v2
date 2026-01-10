import { cva, type VariantProps } from "class-variance-authority";

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
			md: "gap-4",
			lg: "gap-6",
			xl: "gap-8",
			"2xl": "gap-10",
		},

		rowGap: {
			none: "row-gap-0",
			xs: "row-gap-1",
			sm: "row-gap-2",
			md: "row-gap-4",
			lg: "row-gap-6",
			xl: "row-gap-8",
			"2xl": "row-gap-10",
		},

		columnGap: {
			none: "col-gap-0",
			xs: "col-gap-1",
			sm: "col-gap-2",
			md: "col-gap-4",
			lg: "col-gap-6",
			xl: "col-gap-8",
			"2xl": "col-gap-10",
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
