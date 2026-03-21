import { useLocation, useRouter } from "@tanstack/react-router";
import HeartIcon from "@/shared/assets/icons/wait_heart.svg?react";
import { Button } from "@/shared/ui";
import { useMatchFunnelStore } from "../../hooks";
import { matchFlow } from "../../lib/match-flow";
import { useMatchUiStore } from "../../model/store/useMatchUiStore";
import { CancelMatchingIcon } from "./icons/cancel-matching-icon";
import { ExpandMatchingIcon } from "./icons/expand-matching-icon";

export const FloatingMatchingCard = () => {
	const router = useRouter();
	const { isMatching, timeLeft, sessionId } = useMatchUiStore();
	const { setStep } = useMatchFunnelStore.getState();
	const location = useLocation();
	const isMatchPage = location.pathname.startsWith("/match");
	if (!isMatching) return null;
	if (isMatchPage) return null;

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleExpandMatchingPage = () => {
		router.navigate({ to: "/match" });
	};

	const handleCancelMatching = () => {
		matchFlow.cancel(sessionId);
		setStep("profile");
	};

	return (
		<section className="fixed  w-[191px] h-[108px] md:w-[328px] md:h-[185px] left-6 bottom-6 z-50 rounded-[11px] md:rounded-[20px] border border-gray-300 bg-gray-100 animate-slide-in">
			<header className="absolute flex justify-between p-[6px] md:p-3 w-full z-1">
				<Button
					variant="ghost"
					className="p-[6px] [&:has(>svg)]:px-[6px] md:p-3 md:[&:has(>svg)]:px-3 "
					onClick={handleCancelMatching}
				>
					<CancelMatchingIcon />
				</Button>
				<Button
					variant="ghost"
					className="p-[6px] [&:has(>svg)]:px-[6px] md:p-3 md:[&:has(>svg)]:px-3 "
					onClick={handleExpandMatchingPage}
				>
					<ExpandMatchingIcon />
				</Button>
			</header>
			<div className="flex animate-fade-in py-3 flex-col items-center justify-center gap-2 h-full">
				<div className="animate-grow-shrink">
					<HeartIcon className="w-[54px] h-[54px] md:w-[92px] md:h-[92px]" />
				</div>
				<div className="flex flex-col items-center w-full">
					{/* 랜덤 메세지 */}
					<span className="text-gray-800 text-[8px] md:text-[11px] ">
						어떤 사람이 나올까요?
					</span>
					{/* 시간 표시 */}
					<div className="text-gray-600 regular-11">
						<span className="bold-11 text-violet-600">
							{formatTime(timeLeft)}&nbsp;
						</span>
						/ 5:00
					</div>
				</div>
			</div>
		</section>
	);
};
