import { useEffect, useMemo } from "react";
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
	containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function PreciseProfileForm({
	funnel,
	containerRef,
}: PreciseProfileFormProps) {
	const currentProfile = funnel.profile || {};
	const selectedGameStyleIds =
		currentProfile.gameStyleResponseList?.map((s) => s.gameStyleId) || [];
	const currentMike = currentProfile.mike || "UNAVAILABLE";
	const currentGameMode = funnel.gameMode || undefined;

	const gameModeItems = useMemo(() => {
		const allModes = GAME_MODE_ITEMS.slice(1);
		return allModes.filter(
			(item) => item.id === "SOLO" || item.id === "FREE" || item.id === "FAST",
		);
	}, []);

	useEffect(() => {
		const validIds = new Set(gameModeItems.map((i) => i.id));
		const current = funnel.gameMode;
		if (current && !validIds.has(current)) {
			const first = gameModeItems[0]?.id;
			funnel.toStep("profile", {
				gameMode: (first as GameMode | undefined) ?? null,
			});
		}
	}, [funnel.gameMode, gameModeItems]);

	const handleGameModeChange = (value: GameMode | undefined) => {
		funnel.toStep("profile", {
			gameMode: value || null,
		});
	};

	const handlePositionChange = (
		field: "mainP" | "subP" | "wantP",
		position: Position | undefined,
		index?: 0 | 1,
	) => {
		if (field === "wantP") {
			const previousWant = currentProfile.wantP ?? [];
			const nextWant = [...previousWant];
			if (index === 0 || index === 1) {
				if (position) {
					nextWant[index] = position;
				}
			}
			funnel.toStep("profile", {
				profile: {
					...currentProfile,
					wantP: nextWant,
				},
			});
			return;
		}

		funnel.toStep("profile", {
			profile: {
				...currentProfile,
				[field]: position,
			} as MyProfileResponse,
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
			<div>
				<p className="label mb-1.5">포지션</p>
				<div className="flex min-h-[104px] w-full tablet:flex-row flex-col gap-[12px]">
					<div className="h-full flex-1 rounded-[10px] bg-white px-11 py-4">
						<ul className="flex h-full w-full justify-between gap-[8px]">
							<li className="flex h-full w-[49px] flex-col items-center justify-between">
								<span className="bold-12 w-full text-center text-gray-700">
									주 포지션
								</span>
								<PositionSelector
									onChangePosition={(newState) =>
										handlePositionChange("mainP", newState)
									}
									selectedPosition={currentProfile.mainP}
									title={"주 포지션 선택"}
									containerRef={containerRef}
								/>
							</li>

							<li className="flex h-full w-[49px] flex-col items-center justify-between">
								<span className="bold-12 w-full text-center text-gray-700">
									부 포지션
								</span>
								<PositionSelector
									onChangePosition={(newState) =>
										handlePositionChange("subP", newState)
									}
									selectedPosition={currentProfile.subP}
									title={"부 포지션 선택"}
									containerRef={containerRef}
								/>
							</li>
						</ul>
					</div>
					<div className="flex h-full flex-1 flex-col items-center justify-between rounded-[10px] bg-white px-11 py-4">
						<span className="bold-12 text-gray-700">내가 찾는 포지션</span>

						<ul className="flex w-full items-end tablet:justify-center justify-between gap-4">
							<li className="flex flex-col items-center justify-between">
								<PositionSelector
									onChangePosition={(newState) =>
										handlePositionChange("wantP", newState, 0)
									}
									selectedPosition={currentProfile.wantP?.[0]}
									containerRef={containerRef}
								/>
							</li>
							<li>
								<PositionSelector
									onChangePosition={(newState) =>
										handlePositionChange("wantP", newState, 1)
									}
									selectedPosition={currentProfile.wantP?.[1]}
									containerRef={containerRef}
								/>
							</li>
						</ul>
					</div>
				</div>
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
