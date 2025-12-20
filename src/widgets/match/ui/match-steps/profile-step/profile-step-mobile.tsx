import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import TierBadge from "@/entities/game/ui/tier-badge";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import type { MyProfileResponse } from "@/shared/api";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";
import BasicProfileForm from "./basic-profile-form";
import PreciseProfileForm from "./precise-profile-form";

interface ProfileStepMobileProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

export default function ProfileStepMobile({
	funnel,
	user,
}: ProfileStepMobileProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	if (!user) return null;

	const matchType = funnel.type;

	const handleMatchStart = () => {
		const currentProfile = funnel.profile || {};
		const currentMike = currentProfile.mike || user?.mike || "UNAVAILABLE";
		const normalizedProfile =
			matchType === "PRECISE"
				? {
						mike: currentMike,
						mainP: currentProfile.mainP || user?.mainP || undefined,
						subP: currentProfile.subP || user?.subP || undefined,
						wantP: currentProfile.wantP || user?.wantP || undefined,
						gameStyleResponseList:
							currentProfile.gameStyleResponseList ||
							user?.gameStyleResponseList ||
							undefined,
					}
				: {
						mike: currentMike,
						gameStyleResponseList:
							currentProfile.gameStyleResponseList ||
							user?.gameStyleResponseList ||
							undefined,
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
				className="flex w-full items-center justify-center pt-0"
				ref={containerRef}
			>
				<div className="w-full max-w-[1440px] px-[20px] pt-[16px]">
					<div className="mt-[12px] mb-[28px] flex w-full flex-col gap-4">
						<div
							className={`flex w-full flex-col gap-2 rounded-2xl p-6 ${
								matchType === "BASIC" ? "bg-gray-100" : "bg-violet-100"
							}`}
						>
							{/* Avatar + name */}
							<div className="flex items-center gap-4">
								<EditableProfileAvatar variant="sm" />
								<div className="flex flex-col">
									<p className="bold-20 text-gray-800">{user.gameName}</p>
									<p className="semibold-14 text-gray-500">#{user.tag}</p>
								</div>
							</div>

							{/* Ranks */}
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col">
									<span className="semibold-12 mb-1.5 text-gray-800">
										솔로랭크
									</span>
									<TierBadge tier={user.soloTier} rank={user.soloRank} />
								</div>
								<div className="flex flex-col">
									<span className="semibold-12 mb-1.5 text-gray-800">
										자유랭크
									</span>
									<TierBadge tier={user.freeTier} rank={user.freeRank} />
								</div>
							</div>

							<div className="w-full border-gray-400 border-b" />

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

						<div className="flex w-full">
							<Button
								variant="default"
								className="h-14 w-full rounded-2xl px-8"
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
