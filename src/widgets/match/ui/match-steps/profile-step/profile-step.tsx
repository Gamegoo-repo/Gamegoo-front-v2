import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import TierBadge from "@/entities/game/ui/tier-badge";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import type { MyProfileResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { useResponsive } from "@/shared/model/responsive-context";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";
import BasicProfileForm from "./basic-profile-form";
import PreciseProfileForm from "./precise-profile-form";
import ProfileStepMobile from "./profile-step-mobile";

interface ProfileStepProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

function ProfileStep({ funnel, user }: ProfileStepProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { isMobile } = useResponsive();

	const matchType = funnel.type;

	if (!user) return null;

	if (isMobile) {
		return <ProfileStepMobile funnel={funnel} user={user} />;
	}

	const handleMatchStart = () => {
		const currentProfile = funnel.profile || {};
		const currentMike = currentProfile.mike || "UNAVAILABLE";
		const normalizedProfile =
			matchType === "PRECISE"
				? {
						...currentProfile,
						mike: currentMike,
						mainP: currentProfile.mainP ?? undefined,
						subP: currentProfile.subP ?? undefined,
						wantP: currentProfile.wantP ?? undefined,
						gameStyleResponseList:
							currentProfile.gameStyleResponseList ?? undefined,
					}
				: {
						...currentProfile,
						mike: currentMike,
						mainP: currentProfile.mainP ?? undefined,
						subP: currentProfile.subP ?? undefined,
						gameStyleResponseList:
							currentProfile.gameStyleResponseList ?? undefined,
					};
		const payload = {
			profile: normalizedProfile,
			gameMode: funnel.gameMode || null,
		} as const;
		funnel.toStep("match-start", payload);
	};

	return (
		<>
			<MatchHeader
				title="프로필 등록"
				onBack={() => router.navigate({ to: "/" })}
				showMatchTypeToggle
				funnel={funnel}
			/>
			<div
				className="flex w-full items-center justify-center mobile:pt-0 pt-[110px]"
				ref={containerRef}
			>
				<div className="w-full max-w-[1440px] mobile:px-[20px] px-[80px] mobile:pt-[24px] pt-[60px]">
					<div className="mobile:mt-[15px] mt-[72px] mb-[150px] flex w-full flex-col items-center gap-4">
						<div
							className={cn(
								"flex w-full gap-[32px] rounded-2xl p-12",
								matchType === "BASIC" ? "bg-gray-100" : "bg-violet-100",
							)}
						>
							<EditableProfileAvatar variant="lg" />
							<div className="flex flex-1 flex-col items-start gap-[36px] py-[20px]">
								<div className="flex w-full flex-col items-start gap-[24px]">
									<div className="flex items-center gap-2">
										<p className="bold-32 text-gray-800">{user.gameName}</p>
										<p className="bold-20 text-gray-500">#{user.tag}</p>
									</div>
									<div className="flex gap-[28px]">
										<div className="w-1/2">
											<span className="semibold-14 mb-1.5 text-gray-800">
												솔로랭크
											</span>
											<TierBadge tier={user.soloTier} rank={user.soloRank} />
										</div>
										<div className="w-1/2">
											<span className="semibold-14 mb-1.5 text-gray-800">
												자유랭크
											</span>
											<TierBadge tier={user.freeTier} rank={user.freeRank} />
										</div>
									</div>
									<div className="w-full border-gray-400 border-b" />
								</div>
								{matchType === "BASIC" && (
									<BasicProfileForm
										funnel={funnel}
										containerRef={
											containerRef as React.RefObject<HTMLDivElement | null>
										}
									/>
								)}
								{matchType === "PRECISE" && (
									<PreciseProfileForm
										funnel={funnel}
										containerRef={
											containerRef as React.RefObject<HTMLDivElement | null>
										}
									/>
								)}
							</div>
						</div>
						<div className="flex w-full justify-end">
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
			</div>
		</>
	);
}

export default ProfileStep;
