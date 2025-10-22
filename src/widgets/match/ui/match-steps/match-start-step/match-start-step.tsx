import { useEffect, useState } from "react";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";
import MatchLoadingCard from "./match-loading-card";
import MatchStartProfile from "./match-start-profile";

const MAX_MATCHING_TIME = 300; // 5분
const TIMER_INTERVAL = 1000; // 1초

interface MatchStartStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchStartStep({ funnel }: MatchStartStepProps) {
	const [isLoading, _setIsLoading] = useState(true);
	const [timeLeft, setTimeLeft] = useState(MAX_MATCHING_TIME);
	const [tierCounts, _setTierCounts] = useState<Record<string, number>>({});
	const [userTier, _setUserTier] = useState("UNRANKED");

	// 타이머 로직
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, TIMER_INTERVAL);

		return () => clearInterval(timer);
	}, []);

	return (
		<>
			<MatchHeader
				step="match-start"
				title="매칭 중"
				subtitle="나와 꼭 맞는 상대를 찾는 중..."
				onBack={() => funnel.toStep("profile")}
			/>
			<div className="flex justify-center p-10 items-center h-fit gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
				<MatchStartProfile />
				{isLoading ? (
					<MatchLoadingCard
						timeLeft={timeLeft}
						tierCounts={tierCounts}
						userTier={userTier}
					/>
				) : (
					<MatchStartProfile opponent />
				)}
			</div>
		</>
	);
}

export default MatchStartStep;
