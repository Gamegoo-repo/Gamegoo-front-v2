import { useMemo } from "react";
import { GAME_MODE_ITEMS } from "@/features/board/config/dropdown-items";
import { GAME_STYLE } from "@/features/board/config/game-styles";
import { getGameModeTitle } from "@/features/board/lib/getGameModeTitle";
import GameStylePopover from "@/features/board/ui/game-style-popover";
import PositionSelector from "@/features/board/ui/position-selector";
import type { GameMode, MyProfileResponse, Position } from "@/shared/api";
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
	const currentProfile = funnel.profile || {};
	const selectedGameStyleIds =
		currentProfile.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		user?.gameStyleResponseList?.map((s) => s.gameStyleId) ||
		[];
	const currentMike = currentProfile.mike || user?.mike || "UNAVAILABLE";
	const currentGameMode = funnel.gameMode || undefined;

	const gameModeItems = useMemo(() => {
		const allModes = GAME_MODE_ITEMS.slice(1);
		return allModes.filter(
			(item) => item.id === "SOLO" || item.id === "FREE" || item.id === "FAST",
		);
	}, []);

	const handleGameModeChange = (value: GameMode | undefined) => {
		funnel.toStep("profile", {
			gameMode: value || null,
		});
	};

	const handleMainPositionChange = (position: Position | undefined) => {
		funnel.toStep("profile", {
			profile: {
				...currentProfile,
				mainP: position,
			},
		});
	};

	const handleSubPositionChange = (position: Position | undefined) => {
		funnel.toStep("profile", {
			profile: {
				...currentProfile,
				subP: position,
			},
		});
	};

	const handleWantPositionChange = (position: Position | undefined) => {
		funnel.toStep("profile", {
			profile: {
				...currentProfile,
				wantP: position ? [position] : [currentProfile.wantP?.[0] ?? "ANY"],
			},
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
			<div>
				<p className="label mb-1.5">포지션</p>
				<div className="flex gap-[12px] h-[104px] w-full">
					<div className="bg-white flex-1 rounded-[10px] h-full px-11 py-4">
						<ul className="w-full flex justify-between h-full gap-[8px]">
							<li className="h-full flex flex-col items-center justify-between w-[49px]">
								<span className="text-gray-700 bold-12 w-full text-center">
									주 포지션
								</span>
								<PositionSelector
									onChangePosition={(newState) =>
										handleMainPositionChange(newState)
									}
									selectedPosition={currentProfile.mainP}
									title={"주 포지션 선택"}
									containerRef={containerRef}
								/>
							</li>

							<li className="h-full flex flex-col items-center justify-between w-[49px]">
								<span className="text-gray-700 bold-12 w-full text-center">
									부 포지션
								</span>
								<PositionSelector
									onChangePosition={(newState) =>
										handleSubPositionChange(newState)
									}
									selectedPosition={currentProfile.subP}
									title={"부 포지션 선택"}
									containerRef={containerRef}
								/>
							</li>
						</ul>
					</div>
					<div className="bg-white flex-1 rounded-[10px] h-full px-11 py-4 flex flex-col items-center justify-between">
						<span className="text-gray-700 bold-12">내가 찾는 포지션</span>

						<ul className="flex w-full justify-center gap-4 items-end">
							<li className="flex flex-col items-center justify-between">
								<PositionSelector
									onChangePosition={(newState) => {
										handleWantPositionChange(newState);
									}}
									selectedPosition={currentProfile.wantP?.[0]}
									title={"내가 찾는 포지션"}
									containerRef={containerRef}
								/>
							</li>
						</ul>
					</div>
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
		</>
	);
}
