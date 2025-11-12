import { useRef } from "react";
import TierFullNameBadge from "@/entities/game/ui/tier-full-name-badge";
import { GAME_STYLE } from "@/features/board/config/game-styles";
import GameStylePopover from "@/features/board/ui/game-style-popover";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import type { MyProfileResponse } from "@/shared/api";
import { socketManager } from "@/shared/api/socket";
import { Button } from "@/shared/ui";
import CloseButton from "@/shared/ui/button/close-button";
import { Switch } from "@/shared/ui/toggle-switch/switch";
import type { UseMatchFunnelReturn } from "../../hooks";
import MatchHeader from "../match-header";

interface ProfileStepProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

function ProfileStep({ funnel, user }: ProfileStepProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	if (!user) return null;

	const currentProfile = funnel.context.profile || {};
	const selectedGameStyleIds =
		currentProfile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		user?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		[];
	const currentMike = currentProfile.mike || user?.mike || "UNAVAILABLE";

	const handleGameStyleToggle = (styleId: number) => {
		const currentIds = selectedGameStyleIds;
		let newIds: number[];

		if (currentIds.includes(styleId)) {
			newIds = currentIds.filter((id) => id !== styleId);
		} else if (currentIds.length < 3) {
			// 추가 (최대 3개)
			newIds = [...currentIds, styleId];
		} else {
			// 최대 개수 초과
			return;
		}

		const newGameStyleResponseList = newIds
			.map((id) => {
				const style = GAME_STYLE.find((s) => s.gameStyleId === id);
				return style
					? {
							gameStyleId: style.gameStyleId,
							gameStyleName: style.gameStyleName,
						}
					: null;
			})
			.filter(
				(item): item is { gameStyleId: number; gameStyleName: string } =>
					item !== null,
			);

		funnel.toStep("profile", {
			profile: {
				...currentProfile,
				gameStyleResponseList: newGameStyleResponseList,
			},
		});
	};

	const handleMikeChange = (checked: boolean) => {
		const newMike = checked ? "AVAILABLE" : "UNAVAILABLE";
		funnel.toStep("profile", {
			profile: {
				...currentProfile,
				mike: newMike,
			},
		});
	};

	const handleMatchStart = () => {
		if (!socketManager.connected) {
			console.error("Socket is not connected.");
			return;
		}

		funnel.toStep("match-start", {
			profile: {
				mike: currentMike,
				mainP: user?.mainP || undefined,
				subP: user?.subP || undefined,
				wantP: user?.wantP || undefined,
				gameStyleResponseList:
					selectedGameStyleIds
						.map((id) => {
							const style = GAME_STYLE.find((s) => s.gameStyleId === id);
							return style
								? {
										gameStyleId: style.gameStyleId,
										gameStyleName: style.gameStyleName,
									}
								: null;
						})
						.filter(
							(item): item is { gameStyleId: number; gameStyleName: string } =>
								item !== null,
						) || undefined,
			},
		});
	};

	return (
		<>
			<MatchHeader
				step="profile"
				title="프로필 등록"
				onBack={() => funnel.toStep("game-mode")}
			/>
			<div
				className="w-full flex justify-center items-center"
				ref={containerRef}
			>
				<div className="w-full flex flex-col items-center gap-4">
					<div className="w-full flex bg-violet-100 rounded-2xl p-12 gap-8">
						<EditableProfileAvatar />
						<div className="flex flex-col items-start gap-8 flex-1">
							<div className="flex items-center gap-2">
								<p className="text-gray-800 bold-32">{user.gameName}</p>
								<p className="text-gray-500 bold-20">#{user.tag}</p>
							</div>
							<div className="flex gap-12">
								<div className="w-1/2">
									<span className="mb-1.5 text-gray-800 semibold-14">
										솔로랭크
									</span>
									<TierFullNameBadge
										tier={user.soloTier}
										rank={user.soloRank}
									/>
								</div>
								<div className="w-1/2">
									<span className="mb-1.5 text-gray-800 semibold-14">
										자유랭크
									</span>
									<TierFullNameBadge
										tier={user.freeTier}
										rank={user.freeRank}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<p className="label">게임 스타일</p>
								<div className="w-full flex gap-2 items-center flex-wrap gap-y-3">
									{selectedGameStyleIds.map((styleId) => {
										const style = GAME_STYLE.find(
											(item) => item.gameStyleId === styleId,
										);
										return style ? (
											<span
												key={styleId}
												className="flex items-center justify-center px-3 py-1 bg-white rounded-full gap-1"
											>
												{style.gameStyleName}
												<CloseButton
													className="p-0 hover:bg-gray-100 rounded-full"
													iconClass="w-5 text-gray-600"
													onClose={() => handleGameStyleToggle(styleId)}
												/>
											</span>
										) : null;
									})}
									{selectedGameStyleIds.length < 3 && (
										<GameStylePopover
											selectedGameStyle={selectedGameStyleIds}
											containerRef={containerRef}
											onChangeGameStyle={handleGameStyleToggle}
										/>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-2 w-full">
								<p className="label">마이크</p>
								<Switch
									checked={currentMike === "AVAILABLE"}
									onCheckedChange={handleMikeChange}
								/>
							</div>
						</div>
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
