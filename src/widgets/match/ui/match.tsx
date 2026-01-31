import { useEffect } from "react";
import { useMatchFunnel } from "../hooks/use-match-funnel";
import { MatchStartStep, ProfileStep } from "./match-steps";
import MatchCompleteStep from "./match-steps/match-complete-step/match-complete-step";
import { useMatchUiStore } from "../model/store/useMatchUiStore";

function MatchComponent() {
	const funnel = useMatchFunnel();
	const isMatching = useMatchUiStore((s) => s.isMatching);

	// 매칭이 끝났는데 /match 화면이 남아있지 않게 강제
	useEffect(() => {
		if (funnel.step === "match-start" && !isMatching) funnel.toStep("profile");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [funnel.step, isMatching]);

	if (funnel.step === "profile") {
		return <ProfileStep funnel={funnel} user={funnel.user} />;
	}

	if (funnel.step === "match-start") {
		return <MatchStartStep funnel={funnel} />;
	}

	if (funnel.step === "match-complete") {
		return <MatchCompleteStep funnel={funnel} />;
	}

	return <div>Loading...</div>;
}

export default MatchComponent;
