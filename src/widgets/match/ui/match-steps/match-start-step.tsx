import type { UseMatchFunnelReturn } from "../../hooks";
import MatchHeader from "../match-header";

interface MatchStartStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchStartStep({ funnel }: MatchStartStepProps) {
	return (
		<>
			<MatchHeader
				step="match-start"
				title="매칭 시작"
				onBack={() => funnel.toStep("profile")}
			/>
			<div>afe</div>
		</>
	);
}

export default MatchStartStep;
