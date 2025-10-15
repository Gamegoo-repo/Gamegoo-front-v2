import BackIcon from "@/shared/assets/icons/back.svg?react";
import StepNextIcon from "@/shared/assets/icons/step_next.svg?react";
import { MATCH_STEPS_LABEL } from "../lib/constants";
import type { FunnelStep } from "../lib/types";

interface MatchHeaderProps {
	step: FunnelStep;
	title: string;
	subtitle?: string;
	onBack?: () => void;
	showBackButton?: boolean;
}

function MatchHeader({
	step,
	title,
	subtitle,
	onBack,
	showBackButton = true,
}: MatchHeaderProps) {
	const getCurrentStepIndex = () => {
		switch (step) {
			case "type":
				return 0;
			case "game-mode":
				return 1;
			case "profile":
				return 2;
			case "match-start":
				return 3;
			default:
				return 0;
		}
	};

	const currentStepIndex = getCurrentStepIndex();

	if (currentStepIndex > MATCH_STEPS_LABEL.length - 1) {
		return null;
	}

	return (
		<div className="w-full bg-white sticky top-0 z-50">
			<div className="max-w-6xl mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{showBackButton && onBack && (
							<button
								type="button"
								onClick={onBack}
								className="flex justify-center items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
							>
								<BackIcon />
							</button>
						)}
						<div className="text-center">
							<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
							{subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
						</div>
					</div>

					<div className="flex items-center font-semibold text-base relative md:text-base sm:text-sm">
						<div className="flex items-center gap-2">
							{MATCH_STEPS_LABEL.map((stepName, index) => (
								<div
									key={stepName}
									className={`flex items-center cursor-pointer transition-colors duration-300 ${
										index <= currentStepIndex
											? "text-gray-600"
											: "text-gray-400"
									}`}
								>
									{stepName}
									{index !== MATCH_STEPS_LABEL.length - 1 && (
										<div className="ml-2.5 p-1.5 border border-gray-300 bg-gray-200 rounded-full inline-flex items-center justify-center">
											<StepNextIcon />
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MatchHeader;
