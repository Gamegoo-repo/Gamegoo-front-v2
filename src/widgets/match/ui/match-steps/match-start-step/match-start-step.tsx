import { useState } from "react";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";
import MatchLoadingCard from "./match-loading-card";
import MatchStartProfile from "./match-start-profile";

interface MatchStartStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchStartStep({ funnel }: MatchStartStepProps) {
	const [isLoading, _setIsLoading] = useState(true);

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
				{isLoading ? <MatchLoadingCard /> : <MatchStartProfile opponent />}
			</div>
		</>
	);
}

export default MatchStartStep;
