import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../hooks";
import MatchHeader from "../match-header";

interface ProfileStepProps {
	funnel: UseMatchFunnelReturn;
}

function ProfileStep({ funnel }: ProfileStepProps) {
	return (
		<>
			<MatchHeader
				step="profile"
				title="프로필 등록"
				onBack={() => funnel.toStep("game-mode")}
			/>
			<div className="flex justify-center items-center">
				<Button size="lg" onClick={() => funnel.toStep("match-start")}>
					매칭 시작하기
				</Button>
			</div>
		</>
	);
}

export default ProfileStep;
