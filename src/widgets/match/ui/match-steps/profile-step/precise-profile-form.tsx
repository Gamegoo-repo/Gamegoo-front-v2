import { useMemo } from "react";
import { GAME_MODE_ITEMS } from "@/features/board/config/dropdown-items";
import { GAME_STYLE } from "@/features/board/config/game-styles";
import { getGameModeTitle } from "@/features/board/lib/getGameModeTitle";
import GameStylePopover from "@/features/board/ui/game-style-popover";
import type { GameMode, MyProfileResponse } from "@/shared/api";
import { socketManager } from "@/shared/api/socket";
import { Button } from "@/shared/ui";
import CloseButton from "@/shared/ui/button/close-button";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import { Switch } from "@/shared/ui/toggle-switch/switch";
import type { UseMatchFunnelReturn } from "../../../hooks";

interface PreciseProfileFormProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse;
	containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function PreciseProfileForm({
	funnel,
	user,
	containerRef,
}: PreciseProfileFormProps) {
	const currentProfile = funnel.context.profile || {};
	const selectedGameStyleIds =
		currentProfile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		user?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		[];
	const currentMike = currentProfile.mike || user?.mike || "UNAVAILABLE";
	const currentGameMode = funnel.context.gameMode || undefined;

	// PRECISE: 솔로랭크, 자유랭크, 빠른대전 (칼바람 제외)
	const gameModeItems = useMemo(() => {
		const allModes = GAME_MODE_ITEMS.slice(1); // "모든 모드" 제외
		return allModes.filter(
			(item) => item.id === "SOLO" || item.id === "FREE" || item.id === "FAST",
		);
	}, []);

	const handleGameModeChange = (value: GameMode | undefined) => {
		funnel.toStep("profile", {
			gameMode: value || null,
		});
	};

	const handleGameStyleToggle = (styleId: number) => {
		const currentIds = selectedGameStyleIds;
		let newIds: number[];

		if (currentIds.includes(styleId)) {
			newIds = currentIds.filter((id) => id !== styleId);
		} else if (currentIds.length < 3) {
			newIds = [...currentIds, styleId];
		} else {
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
			gameMode: currentGameMode || null,
		});
	};

	return (
		<>
			<div className="flex flex-col gap-2">
				<p className="label">게임 유형</p>
				<Dropdown
					className="w-[240px] h-14 z-10"
					type="secondary"
					selectedLabel={
						currentGameMode ? getGameModeTitle(currentGameMode) : "선택"
					}
					defaultAction={(value) =>
						handleGameModeChange(value as GameMode | undefined)
					}
					items={gameModeItems}
				/>
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
			<div className="flex justify-end w-full mt-4">
				<Button
					variant="default"
					className="h-14 w-[380px] rounded-2xl px-8"
					onClick={handleMatchStart}
				>
					매칭 시작하기
				</Button>
			</div>
		</>
	);
}
