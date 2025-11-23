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
		<section className="w-full">
			<h3 className="text-gray-800 regular-25 mb-2">
				{userProfile.gameName}님의 매너레벨
				<InfoTooltip
					title={"매너레벨"}
					className="w-[319px]"
					buttonSize={18}
					content="매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매
        너평가를 반영한 지표예요. "
				/>
			</h3>
			<div className="w-full bg-gray-100 rounded-[30px] px-[26px] py-6 h-[264px] flex flex-col justify-between">
				<p className="text-gray-800 text-[1rem] font-medium">
					최근{" "}
					<span className="text-violet-600 bold-16">
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
