import { useRouter } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import type TierBadge from "@/entities/game/ui/tier-badge";
import GameStylePopover from "@/features/board/ui/game-style-popover";
import ProfileSummaryCard from "@/features/profile/profile-summary-card";
import type { Mike, MyProfileResponse } from "@/shared/api";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";

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

	const profileFromState = funnel.profile || {};

	const initialSelectedIds = useMemo<number[]>(
		() =>
			(
				profileFromState.gameStyleResponseList ||
				user?.gameStyleResponseList ||
				[]
			).map((s) => s.gameStyleId),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user, funnel.profile],
	);
	const [selectedGameStyleIds, setSelectedGameStyleIds] =
		useState<number[]>(initialSelectedIds);

	const gameStyleChips = useMemo(
		() =>
			(user?.gameStyleResponseList || [])
				.filter((s) => selectedGameStyleIds.includes(s.gameStyleId))
				.map((s) => s.gameStyleName),
		[user, selectedGameStyleIds],
	);

	if (!user) return null;

	const handleToggleGameStyle = (styleId: number) => {
		setSelectedGameStyleIds((prev) => {
			let next: number[];
			if (prev.includes(styleId)) {
				next = prev.filter((id) => id !== styleId);
			} else if (prev.length < 3) {
				next = [...prev, styleId];
			} else {
				return prev;
			}
			const nextList =
				(user.gameStyleResponseList || []).filter((s) =>
					next.includes(s.gameStyleId),
				) || [];
			funnel.toStep("profile", {
				profile: {
					...(funnel.profile || {}),
					gameStyleResponseList: nextList,
				},
			});
			return next;
		});
	};

	const handleToggleMike = (checked: boolean) => {
		const next: Mike = (checked ? "AVAILABLE" : "UNAVAILABLE") as Mike;
		funnel.toStep("profile", {
			profile: {
				...(funnel.profile || {}),
				mike: next,
			},
		});
	};

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
				className="flex w-full items-center justify-center pt-[20px]"
				ref={containerRef}
			>
				<div className="w-full max-w-[1440px] px-[20px]">
					<div className="mt-[15px] mb-[32px] flex w-full flex-col gap-4">
						<ProfileSummaryCard
							variant="sm"
							gameName={user.gameName}
							tag={user.tag}
							soloTier={
								user.soloTier as Parameters<typeof TierBadge>[0]["tier"]
							}
							soloRank={
								user.soloRank as Parameters<typeof TierBadge>[0]["rank"]
							}
							freeTier={
								user.freeTier as Parameters<typeof TierBadge>[0]["tier"]
							}
							freeRank={
								user.freeRank as Parameters<typeof TierBadge>[0]["rank"]
							}
							gameStyleChips={gameStyleChips}
							gameStyleAddon={
								<GameStylePopover
									selectedGameStyle={selectedGameStyleIds}
									onChangeGameStyle={handleToggleGameStyle}
									containerRef={containerRef}
								/>
							}
							micChecked={(funnel.profile?.mike || user.mike) === "AVAILABLE"}
							onMicToggle={handleToggleMike}
						/>
					</div>

					{/* Action */}
					<div className="mb-[24px] flex w-full justify-end">
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
		</>
	);
}
