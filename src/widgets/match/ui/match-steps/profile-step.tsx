import { ProfileAvatar } from "@/features/profile";
import type { MyProfileResponse } from "@/shared/api";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../hooks";
import MatchHeader from "../match-header";

interface ProfileStepProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

function ProfileStep({ funnel, user }: ProfileStepProps) {
	const handleMatchStart = () => {
		/**
		 * todo: gameStyleIdList 추가
		 */
		funnel.context.profile = {
			mike: user?.mike || undefined,
			mainP: user?.mainP || undefined,
			subP: user?.subP || undefined,
			wantP: user?.wantP || undefined,
		};
		funnel.toStep("match-start");
	};

	return (
		<>
			<MatchHeader
				step="profile"
				title="프로필 등록"
				onBack={() => funnel.toStep("game-mode")}
			/>
			<div className="w-full flex justify-center items-center">
				<div className="w-full flex flex-col items-center gap-4">
					<div className="w-full flex bg-violet-100 rounded-2xl p-4">
						<ProfileAvatar size="lg" profileIndex={2} />
					</div>
					<div className="flex justify-end w-full">
						<Button
							variant="default"
							className="h-14 w-[380px] rounded-2xl px-8"
							onClick={handleMatchStart}
						>
							매칭 시작하기
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProfileStep;
