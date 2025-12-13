import { useMemo } from "react";
import { GAME_MODE_ITEMS } from "@/features/board/config/dropdown-items";
import { GAME_STYLE } from "@/features/board/config/game-styles";
import { getGameModeTitle } from "@/features/board/lib/getGameModeTitle";
import GameStylePopover from "@/features/board/ui/game-style-popover";
import type { GameMode, MyProfileResponse } from "@/shared/api";
import CloseButton from "@/shared/ui/button/close-button";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import { Switch } from "@/shared/ui/toggle-switch/switch";
import type { UseMatchFunnelReturn } from "../../../hooks";

interface BasicProfileFormProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse;
	containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function BasicProfileForm({
	funnel,
	user,
	containerRef,
}: BasicProfileFormProps) {
	const currentProfile = funnel.profile || {};
	const selectedGameStyleIds =
		currentProfile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		user?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		[];
	const currentMike = currentProfile.mike || user?.mike || "UNAVAILABLE";
	const currentGameMode = funnel.gameMode || undefined;

	const gameModeItems = useMemo(() => {
		const allModes = GAME_MODE_ITEMS.slice(1); // "모든 모드" 제외
		return allModes.filter(
			(item) =>
				item.id === "SOLO" ||
				item.id === "FREE" ||
				item.id === "FAST" ||
				item.id === "ARAM",
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

	return (
		<>
			<div className="flex flex-col gap-2">
				<p className="label">게임 유형</p>
				<Dropdown
					className="z-10 h-14 w-[240px]"
					variant="secondary"
					selectedLabel={
						currentGameMode ? getGameModeTitle(currentGameMode) : "선택"
					}
					onSelect={(value) =>
						handleGameModeChange(value as GameMode | undefined)
					}
					items={gameModeItems}
				/>
			</div>
			<div className="flex w-full flex-col gap-2">
				<p className="label">게임 스타일</p>
				<div className="flex w-full flex-wrap items-center gap-2 gap-y-3">
					{selectedGameStyleIds.map((styleId) => {
						const style = GAME_STYLE.find(
							(item) => item.gameStyleId === styleId,
						);
						return style ? (
							<span
								key={styleId}
								className="flex items-center justify-center gap-1 rounded-full bg-white px-3 py-1"
							>
								{style.gameStyleName}
								<CloseButton
									className="rounded-full p-0 hover:bg-gray-100"
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
			<div className="flex w-full flex-col gap-2">
				<p className="label">마이크</p>
				<Switch
					checked={currentMike === "AVAILABLE"}
					onCheckedChange={handleMikeChange}
				/>
			</div>
		</>
	);
}
