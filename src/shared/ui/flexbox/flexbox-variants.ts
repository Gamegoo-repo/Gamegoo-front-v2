import { cva } from "class-variance-authority";

export const flexBoxVariants = cva("flex", {
	variants: {
		// 방향
		direction: {
			row: "flex-row",
			column: "flex-col",
			rowReverse: "flex-row-reverse",
			columnReverse: "flex-col-reverse",
		},

		// 주축 정렬
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},

		// 교차축 정렬
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},

		// gap —(토큰 대신 Tailwind spacing scale로 매핑)
		gap: {
			none: "gap-0",
			xs: "gap-1",
			sm: "gap-2",
			md: "gap-3",
			lg: "gap-4",
			xl: "gap-6",
			"2xl": "gap-8",
			"3xl": "gap-10",
			"4xl": "gap-12",
		},

		// 줄바꿈
		wrap: {
			nowrap: "flex-nowrap",
			wrap: "flex-wrap",
			wrapReverse: "flex-wrap-reverse",
		},

		// 전체 영역
		fullWidth: {
			true: "w-full",
			false: "",
		},
		fullHeight: {
			true: "h-full",
			false: "",
		},
	},

	defaultVariants: {
		direction: "row",
		justify: "start",
		align: "start",
		gap: "none",
		wrap: "nowrap",
		fullWidth: false,
		fullHeight: false,
	},
});
