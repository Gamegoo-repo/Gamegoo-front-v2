import { useEffect } from "react";
import { useMatchFunnel } from "../hooks/use-match-funnel";
import { MatchStartStep, ProfileStep } from "./match-steps";
import MatchCompleteStep from "./match-steps/match-complete-step/match-complete-step";

function MatchComponent() {
	const funnel = useMatchFunnel();

	// 이 화면을 떠날 때 다음 방문 시 프로필 단계에서 시작
	useEffect(() => {
		return () => {
			funnel.toStep("profile");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
