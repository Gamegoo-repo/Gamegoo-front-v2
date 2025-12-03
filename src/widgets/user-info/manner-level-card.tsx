import StepperLevelProgress from "@/entities/user/ui/stepper-level-progress";
import type { MannerResponse, OtherProfileResponse } from "@/shared/api";
import InfoTooltip from "@/shared/ui/tooltip/info-tooltip";

type GameName = Pick<OtherProfileResponse, "gameName">;

export default function MannerLevelCard({
	userProfile,
	userMannerLevelData,
}: {
	userProfile: GameName;
	userMannerLevelData: MannerResponse;
}) {
	return (
		<section className="flex h-full w-full flex-col">
			<h3 className="mb-2 font-semibold mobile:text-2xl text-gray-800 text-lg">
				{userProfile.gameName}님의 매너레벨
				<InfoTooltip
					title={"매너레벨"}
					className="w-[319px]"
					buttonSize={18}
					content="매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매
        너평가를 반영한 지표예요. "
				/>
			</h3>
			<div className="flex h-fit mobile:h-full w-full flex-col justify-between gap-12 mobile:gap-32 mobile:rounded-[30px] rounded-lg bg-gray-100 p-5 mobile:px-[26px] py-6">
				<p className="font-medium mobile:font-medium mobile:text-base text-gray-800 text-sm">
					최근{" "}
					<span className="font-bold text-violet-600">
						{userMannerLevelData?.mannerRatingCount}명의
					</span>{" "}
					사용자가 {userProfile.gameName}님에게 긍정적 매너 평가를 남겼어요.
				</p>

				<StepperLevelProgress
					userLevel={userMannerLevelData.mannerLevel}
					rankPercentile={userMannerLevelData.mannerRank}
				/>
			</div>
		</section>
	);
}
