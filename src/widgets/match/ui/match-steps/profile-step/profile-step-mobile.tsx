import { useRouter } from "@tanstack/react-router";
import { useRef } from "react";
import TierBadge from "@/entities/game/ui/tier-badge";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import type { MyProfileResponse } from "@/shared/api";
import { getAuthUserId } from "@/shared/lib/auth-user";
import { Button } from "@/shared/ui";
import { matchFlow } from "@/widgets/match/lib/match-flow";
import type { UseMatchFunnelReturn } from "../../../hooks";
import MatchHeader from "../../match-header";
import BasicProfileForm from "./basic-profile-form";
import PreciseProfileForm from "./precise-profile-form";

interface ProfileStepMobileProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

const mapPreciseWantPositions = (wantP?: string[] | null) => {
	const normalized = (wantP || []).filter((p): p is string => !!p);
	if (normalized.length === 0) return ["ANY", "ANY"];
	if (normalized.length === 1) {
		const first = normalized[0];
		return first === "ANY" ? ["ANY", "ANY"] : [first, "ANY"];
	}
	return [normalized[0], normalized[1]];
};

const GAME_MODE_THRESHOLD: Record<string, number> = {
	FAST: 15, // 빠른 대전
	SOLO: 50, // 개인 랭크
	FREE: 50, // 자유 랭크
	ARAM: 10, // 칼바람
};

export default function ProfileStepMobile({
	funnel,
	user,
}: ProfileStepMobileProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const authUser = funnel.user;
	if (!user) return null;

	const matchType = funnel.type;

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

		const gameMode = funnel.gameMode;
		if (!gameMode) {
			console.error("❌ [V2-Debug] gameMode가 설정되지 않았습니다:", {
				type: funnel.type,
				gameMode: funnel.gameMode,
				profile: funnel.profile,
			});
			return;
		}

		const profile = funnel.profile || {};
		const matchingData = {
			matchingType: funnel.type ?? "BASIC",
			gameMode: gameMode,
			memberId: getAuthUserId(authUser) ?? undefined,
			threshold: GAME_MODE_THRESHOLD[gameMode],
			mike: profile.mike ?? "UNAVAILABLE",
			mainP: profile.mainP ?? "ANY",
			subP: profile.subP ?? "ANY",
			wantP:
				funnel.type === "PRECISE" ? mapPreciseWantPositions(profile.wantP) : [],
			gameStyleIdList: (() => {
				const ids =
					profile.gameStyleResponseList?.map((s) => s.gameStyleId) || [];
				return ids.length > 0 ? ids : null;
			})(),
		};

		// 매칭 시작 (중복 전송 방지 내부 처리)
		const started = matchFlow.start(matchingData);
		if (!started) return;

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
