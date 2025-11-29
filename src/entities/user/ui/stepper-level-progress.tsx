import { cn } from "@/shared/lib/utils";
import { STEPPER_COLORS } from "../config/stepper-colors";
import StepperStep from "./stepper-step";

export default function StepperLevelProgress({
	userLevel,
	rankPercentile,
}: {
	userLevel: number; // 1 ~ 5
	rankPercentile: number | undefined;
}) {
	const LEVEL_NUMBERS = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
	const progressPercent = ((userLevel - 1) / 4) * 100;
	return (
		<div className="progress flex w-full items-center justify-between">
			<div
				className={cn(
					"progress-bar flex h-[3px] mobile:h-1 w-full mobile:px-5 px-6",
					userLevel < 5 && "mobile:pr-[9px] pr-1",
				)}
			>
				<div
					className="left-5 h-full"
					style={{
						width: `${progressPercent}%`,
						background: `linear-gradient(to right, #DBD6FE, ${STEPPER_COLORS[userLevel - 1]})`,
					}}
				/>
				<div
					className="h-full bg-gray-800"
					style={{
						width: `${100 - progressPercent}%`,
					}}
				/>
			</div>

			<ol className="progress-items w-full">
				{LEVEL_NUMBERS.map((num) => {
					return (
						<StepperStep
							key={num}
							currentLevel={num}
							userLevel={userLevel}
							rankPercentile={rankPercentile}
						/>
					);
				})}
			</ol>
		</div>
	);
}
