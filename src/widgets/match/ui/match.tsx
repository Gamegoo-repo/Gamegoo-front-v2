import { useMatchFunnel } from "../hooks/use-match-funnel";
import { MatchStartStep, ProfileStep } from "./match-steps";
import MatchCompleteStep from "./match-steps/match-complete-step/match-complete-step";

function MatchComponent() {
	const funnel = useMatchFunnel();

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
