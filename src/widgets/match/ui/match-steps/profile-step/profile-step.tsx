import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import TierBadge from "@/entities/game/ui/tier-badge";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import type { MyProfileResponse } from "@/shared/api";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";
import BasicProfileForm from "./basic-profile-form";
import PreciseProfileForm from "./precise-profile-form";

interface ProfileStepProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

function ProfileStep({ funnel, user }: ProfileStepProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	if (!user) return null;

	const matchType = funnel.context.type;

	return (
		<>
			<MatchHeader
				title="프로필 등록"
				onBack={() => router.navigate({ to: "/" })}
				showMatchTypeToggle
				funnel={funnel}
			/>
			<div
				className="w-full flex justify-center items-center"
				ref={containerRef}
			>
				<div className="w-full flex flex-col items-center gap-4">
					<div className="w-full flex bg-violet-100 rounded-2xl p-12 gap-[32px]">
						<EditableProfileAvatar />
						<div className="flex flex-col items-start gap-[36px] py-[20px] flex-1">
							<div className="flex flex-col items-start gap-[24px] w-full">
								<div className="flex items-center gap-2">
									<p className="text-gray-800 bold-32">{user.gameName}</p>
									<p className="text-gray-500 bold-20">#{user.tag}</p>
								</div>
								<div className="flex gap-[28px]">
									<div className="w-1/2">
										<span className="mb-1.5 text-gray-800 semibold-14">
											솔로랭크
										</span>
										<TierBadge tier={user.soloTier} rank={user.soloRank} />
									</div>
									<div className="w-1/2">
										<span className="mb-1.5 text-gray-800 semibold-14">
											자유랭크
										</span>
										<TierBadge tier={user.freeTier} rank={user.freeRank} />
									</div>
								</div>
								<div className=" border-b border-gray-400 w-full" />
							</div>
							{matchType === "BASIC" && (
								<BasicProfileForm
									funnel={funnel}
									user={user}
									containerRef={
										containerRef as React.RefObject<HTMLDivElement | null>
									}
								/>
							)}
							{matchType === "PRECISE" && (
								<PreciseProfileForm
									funnel={funnel}
									user={user}
									containerRef={
										containerRef as React.RefObject<HTMLDivElement | null>
									}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProfileStep;
