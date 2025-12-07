import { cn } from "@/shared/lib/utils";
import type { UseMatchFunnelReturn } from "../hooks";

interface MatchTypeToggleProps {
	funnel: UseMatchFunnelReturn;
	className?: string;
}

export default function MatchTypeToggle({
	funnel,
	className,
}: MatchTypeToggleProps) {
	const handleTypeChange = (newType: "BASIC" | "PRECISE") => {
		funnel.toStep("profile", {
			type: newType,
		});
	};
	return (
		<div className={cn("flex bg-gray-800 rounded-full p-1 w-fit", className)}>
			<button
				type="button"
				onClick={() => handleTypeChange("BASIC")}
				className={cn(
					"px-6 py-2 rounded-full transition-all duration-200 font-semibold text-sm",
					funnel.type === "BASIC"
						? "bg-white text-gray-800"
						: "text-gray-400 hover:text-gray-300",
				)}
			>
				빠른 매칭
			</button>
			<button
				type="button"
				onClick={() => handleTypeChange("PRECISE")}
				className={cn(
					"px-6 py-2 rounded-full transition-all duration-200 font-semibold text-sm",
					funnel.type === "PRECISE"
						? "bg-white text-gray-800"
						: "text-gray-400 hover:text-gray-300",
				)}
			>
				맞춤 매칭
			</button>
		</div>
	);
}
