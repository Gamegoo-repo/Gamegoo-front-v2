import BackIcon from "@/shared/assets/icons/back.svg?react";
import type { UseMatchFunnelReturn } from "../hooks";
import MatchTypeToggle from "./match-type-toggle";

interface MatchHeaderProps {
	title: string;
	subtitle?: string;
	onBack?: () => void;
	showBackButton?: boolean;
	showMatchTypeToggle?: boolean;
	funnel?: UseMatchFunnelReturn;
}

function MatchHeader({
	title,
	subtitle,
	onBack,
	showBackButton = true,
	showMatchTypeToggle = false,
	funnel,
}: MatchHeaderProps) {
	return (
		<div className="z-50 w-full bg-white">
			<div className="mx-auto max-w-6xl px-0 py-0 md:px-4 md:py-6">
				<div className="flex flex-col items-start justify-between gap-2 px-6 md:flex-row md:items-center md:px-0">
					<div className="flex items-center gap-2">
						{showBackButton && onBack && (
							<button
								type="button"
								onClick={onBack}
								className="flex cursor-pointer items-center justify-center text-gray-600 transition-colors duration-200 hover:text-gray-900"
							>
								<BackIcon />
							</button>
						)}
						<div className="flex items-center gap-2 text-center">
							<h1 className="font-bold text-gray-900 text-xl md:text-3xl">
								{title}
							</h1>
							{subtitle && (
								<p className="text-gray-600 text-sm md:text-lg">{subtitle}</p>
							)}
						</div>
					</div>

					{showMatchTypeToggle && funnel && <MatchTypeToggle funnel={funnel} />}
				</div>
			</div>
		</div>
	);
}

export default MatchHeader;
