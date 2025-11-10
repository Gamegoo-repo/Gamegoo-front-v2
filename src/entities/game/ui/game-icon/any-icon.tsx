import { cn } from "@/shared/lib/utils";

export function AnyIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("position-icon w-6", className)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Position icon</title>

			<path
				className="primary"
				d="M5.2002 12H18.8002"
				stroke="currentColor"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
			<path
				className="primary"
				d="M8.59912 17.6992L15.3991 6.29922"
				stroke="currentColor"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
			<path
				className="primary"
				d="M15.3994 17.6992L8.59942 6.29922"
				stroke="currentColor"
				strokeWidth="2.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}
