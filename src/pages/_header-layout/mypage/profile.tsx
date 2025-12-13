import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import TierBadge from "@/entities/game/ui/tier-badge";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { userKeys } from "@/entities/user/config/query-keys";
import GameStylePopover from "@/features/board/ui/game-style-popover";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import ProfileSummaryCard from "@/features/profile/profile-summary-card";
import { api, type Mike } from "@/shared/api";
import { useResponsive } from "@/shared/model/responsive-context";
import { Switch } from "@/shared/ui/toggle-switch/switch";

export const Route = createFileRoute("/_header-layout/mypage/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: user } = useFetchMyInfo();
	const containerRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const { isMobile } = useResponsive();

	const initialGameStyleIds = useMemo(
		() => (user?.gameStyleResponseList || []).map((s) => s.gameStyleId) ?? [],
		[user],
	);
	const [selectedGameStyleIds, setSelectedGameStyleIds] =
		useState<number[]>(initialGameStyleIds);

	useEffect(() => {
		setSelectedGameStyleIds(initialGameStyleIds);
	}, [initialGameStyleIds]);

	const updateGameStyleMutation = useMutation({
		mutationFn: async (ids: number[]) => {
			await api.private.member.addGameStyle({
				gameStyleIdList: ids,
			});
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.me() });
		},
	});

	const updateMikeMutation = useMutation({
		mutationFn: async (next: Mike) => {
			await api.private.member.modifyIsMike({ mike: next });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.me() });
		},
	});

	const handleToggleGameStyle = async (styleId: number) => {
		const currentIds = selectedGameStyleIds;
		let nextIds: number[];

		if (currentIds.includes(styleId)) {
			nextIds = currentIds.filter((id) => id !== styleId);
		} else if (currentIds.length < 3) {
			nextIds = [...currentIds, styleId];
		} else {
			// 최대 3개 제한
			return;
		}
		setSelectedGameStyleIds(nextIds);
		updateGameStyleMutation.mutate(nextIds);
	};

	const handleToggleMike = (checked: boolean) => {
		const next: Mike = (checked ? "AVAILABLE" : "UNAVAILABLE") as Mike;
		updateMikeMutation.mutate(next);
	};

	if (isMobile) {
		if (!user) {
			return null;
		}
		return (
			<div className="h-full w-full">
				<div className="mb-4 flex items-center gap-3">
					<h2 className="bold-25 flex-1 border-gray-200 border-b pb-4">
						내 정보
					</h2>
				</div>
				<div
					className="flex w-full items-center justify-center"
					ref={containerRef}
				>
					<div className="w-full">
						<ProfileSummaryCard
							variant={isMobile ? "sm" : "lg"}
							gameName={user.gameName}
							tag={user.tag}
							soloTier={user.soloTier}
							soloRank={user.soloRank}
							freeTier={user.freeTier}
							freeRank={user.freeRank}
							gameStyleChips={
								(user.gameStyleResponseList || [])
									.filter((s) => selectedGameStyleIds.includes(s.gameStyleId))
									.map((s) => s.gameStyleName) || []
							}
							gameStyleAddon={
								<GameStylePopover
									selectedGameStyle={selectedGameStyleIds}
									onChangeGameStyle={handleToggleGameStyle}
									containerRef={containerRef}
								/>
							}
							micChecked={user.mike === "AVAILABLE"}
							onMicToggle={handleToggleMike}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full w-full">
			{/* Header */}
			<div className="mb-4 flex items-center gap-3">
				<h2 className="bold-25 flex-1 border-gray-200 border-b pb-4">
					내 정보
				</h2>
			</div>

			{/* Profile Card */}
			<div
				className="flex w-full gap-8 rounded-[30px] bg-gray-100 p-10"
				ref={containerRef}
			>
				{/* Avatar with edit */}
				<div className="shrink-0">
					<EditableProfileAvatar variant="lg" />
				</div>

				{/* Right content */}
				<div className="flex flex-1 flex-col gap-7">
					{/* Name and tag */}
					<div className="flex items-center gap-2">
						<p className="bold-32 text-gray-800">{user?.gameName}</p>
						<p className="bold-20 text-gray-500">#{user?.tag}</p>
					</div>

					{/* Ranks */}
					<div className="flex gap-[28px]">
						<div>
							<span className="semibold-14 mb-1.5 text-gray-800">솔로랭크</span>
							{user && <TierBadge tier={user.soloTier} rank={user.soloRank} />}
						</div>
						<div>
							<span className="semibold-14 mb-1.5 text-gray-800">자유랭크</span>
							{user && <TierBadge tier={user.freeTier} rank={user.freeRank} />}
						</div>
					</div>

					<div className="w-full border-gray-400 border-b" />

					{/* Game style */}
					<div className="flex flex-col gap-3">
						<span className="semibold-14 text-gray-600">게임 스타일</span>
						{selectedGameStyleIds.length ? (
							<ul className="flex flex-wrap gap-2">
								{(user?.gameStyleResponseList || [])
									.filter((s) => selectedGameStyleIds.includes(s.gameStyleId))
									.map((style) => (
										<li
											key={style.gameStyleId}
											className="semibold-16 rounded-full bg-white px-4 py-1.5 text-gray-700"
										>
											{style.gameStyleName}
										</li>
									))}
								<li>
									<GameStylePopover
										selectedGameStyle={selectedGameStyleIds}
										onChangeGameStyle={handleToggleGameStyle}
										containerRef={containerRef}
									/>
								</li>
							</ul>
						) : (
							<div className="flex items-center gap-2">
								<span className="medium-14 text-gray-400">
									선택한 게임 스타일이 없어요
								</span>
								<GameStylePopover
									selectedGameStyle={selectedGameStyleIds}
									onChangeGameStyle={handleToggleGameStyle}
									containerRef={containerRef}
								/>
							</div>
						)}
					</div>

					{/* Mic switch */}
					<div className="flex items-center gap-4">
						<span className="semibold-14 text-gray-800">마이크</span>
						<Switch
							checked={user?.mike === "AVAILABLE"}
							onCheckedChange={handleToggleMike}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
