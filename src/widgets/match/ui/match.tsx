import { useRouter } from "@tanstack/react-router";
import { useMatchFunnel } from "../hooks/use-match-funnel";
import MatchHeader from "./match-header";

function MatchComponent() {
	const funnel = useMatchFunnel();
	const router = useRouter();

	// Step 1: 게임 모드 선택
	if (funnel.step === "type") {
		return (
			<>
				<MatchHeader
					step="type"
					title="매칭 종류 선택"
					onBack={() => router.navigate({ to: "/" })}
				/>
				<div></div>
			</>
		);
	}

	return <div>Loading...</div>;
}

export default MatchComponent;
