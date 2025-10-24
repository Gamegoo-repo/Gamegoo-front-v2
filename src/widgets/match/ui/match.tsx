import { useMatchFunnel } from "../hooks/use-match-funnel";
import {
	GameModeStep,
	MatchStartStep,
	MatchTypeStep,
	ProfileStep,
} from "./match-steps";
import MatchCompleteStep from "./match-steps/match-complete-step/match-complete-step";

function MatchComponent() {
	const funnel = useMatchFunnel();

	// Step 1: 매칭 종류 선택
	if (funnel.step === "match-type") {
		return <MatchTypeStep funnel={funnel} />;
	}

	// Step 2: 게임 모드 선택
	if (funnel.step === "game-mode") {
		return <GameModeStep funnel={funnel} />;
	}

	// Step 3: 프로필 등록
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
