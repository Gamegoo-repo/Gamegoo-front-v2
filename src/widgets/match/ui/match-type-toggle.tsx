import { cn } from "@/shared/lib/utils";
import { useMatchFunnel } from "../hooks";

interface MatchTypeToggleProps {
	className?: string;
}

export default function MatchTypeToggle({ className }: MatchTypeToggleProps) {
	const {
		toStep,
		context: { type },
	} = useMatchFunnel();
	const handleTypeChange = (newType: "BASIC" | "PRECISE") => {
		toStep("profile", {
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
					type === "BASIC"
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
					type === "PRECISE"
						? "bg-white text-gray-800"
						: "text-gray-400 hover:text-gray-300",
				)}
			>
				맞춤 매칭
			</button>
		</div>
	);
}
