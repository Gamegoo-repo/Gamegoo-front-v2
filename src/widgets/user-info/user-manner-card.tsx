import { getMannerText } from "@/entities/user/lib/get-manner-text";
import StepperLevelProgress from "@/entities/user/ui/stepper-level-progress";
import type {
	MannerKeywordListResponse,
	MannerResponse,
	OtherProfileResponse,
} from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import InfoTooltip from "@/shared/ui/tooltip/info-tooltip";

export default function UserMannerCard({
	userProfileData,
	userMannerLevelData,
	userMannerKeywordData,
}: {
	userProfileData: OtherProfileResponse;
	userMannerLevelData: MannerResponse;
	userMannerKeywordData: MannerKeywordListResponse;
}) {
	return (
		<section className="flex w-full gap-3">
			<div className="flex-1">
				<h3 className="regular-25 mb-2 text-gray-800">
					{userProfileData.gameName}님의 매너레벨
					<InfoTooltip
						title={"매너레벨"}
						className="w-[319px]"
						buttonSize={18}
						content="매너 레벨은 겜구 사용자로부터 받은 매너평가, 비매
    너평가를 반영한 지표예요. "
					/>
				</h3>
				<div className="flex h-[264px] w-full flex-col justify-between rounded-[30px] bg-gray-100 px-[26px] py-6">
					<p className="font-medium text-[1rem] text-gray-800">
						최근{" "}
						<span className="bold-16 text-violet-600">
							{userMannerLevelData.mannerRatingCount}명의
						</span>{" "}
						사용자가 {userProfileData.gameName}님에게 긍정적 매너 평가를
						남겼어요.
					</p>

					<StepperLevelProgress
						userLevel={userMannerLevelData.mannerLevel}
						rankPercentile={userMannerLevelData.mannerRank}
					/>
				</div>
			</div>

			<div>
				<h3 className="regular-25 mb-2 text-gray-800">받은 비매너평가</h3>
				<div className="h-[264px] w-[221px] rounded-[20px] bg-gray-800 px-6 py-7">
					<ul className="flex h-full w-full flex-col justify-between">
						{userMannerKeywordData.mannerKeywords
							.slice(6)
							.map((mannerKeyword) => (
								<li
									key={mannerKeyword.mannerKeywordId}
									className={cn(
										"medium-16 flex w-full items-center justify-between text-white",
										mannerKeyword.count === 0 && "text-gray-500",
									)}
								>
									{getMannerText(mannerKeyword.mannerKeywordId)}
									<span
										className={cn(
											"bold-16",
											mannerKeyword,
											mannerKeyword.count > 0 && "text-red-500",
										)}
									>
										{mannerKeyword.count}
									</span>
								</li>
							))}
					</ul>
				</div>
			</div>
		</section>
	);
}
