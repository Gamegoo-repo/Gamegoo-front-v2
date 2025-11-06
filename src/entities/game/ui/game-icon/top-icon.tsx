import { cn } from "@/shared/lib/utils";

export default function TopIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("position-icon w-6", className)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Position icon</title>

			<path
				d="M4 18.2218V4H18.2228L15.556 6.66659H6.66678V15.5552L4 18.2218Z"
				fill="currentColor"
			/>
			<path
				className="primary"
				d="M20 5.7782V20H5.77718L8.44396 17.3334H17.3332V8.44479L20 5.7782Z"
				fill="#B5C1D2"
			/>
			<rect
				className="primary"
				x="9.33398"
				y="9.33203"
				width="5.33356"
				height="5.33317"
				fill="#B5C1D2"
			/>
		</svg>
	);
}
