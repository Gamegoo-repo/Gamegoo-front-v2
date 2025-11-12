import BackIcon from "@/shared/assets/icons/back.svg?react";
import MatchTypeToggle from "./match-type-toggle";

interface MatchHeaderProps {
	title: string;
	subtitle?: string;
	onBack?: () => void;
	showBackButton?: boolean;
	showMatchTypeToggle?: boolean;
}

function MatchHeader({
	title,
	subtitle,
	onBack,
	showBackButton = true,
	showMatchTypeToggle = false,
}: MatchHeaderProps) {
	return (
		<div className="w-full bg-white sticky top-0 z-50">
			<div className="max-w-6xl mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{showBackButton && onBack && (
							<button
								type="button"
								onClick={onBack}
								className="flex justify-center items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
							>
								<BackIcon />
							</button>
						)}
						<div className="flex gap-2 items-center text-center">
							<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
							{subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
						</div>
					</div>

					{showMatchTypeToggle && <MatchTypeToggle />}
				</div>
			</div>
		</div>
	);
}

export default MatchHeader;
