import type { ReactNode, RefObject } from "react";
import TierBadge from "@/entities/game/ui/tier-badge";
import EditableProfileAvatar from "@/features/profile/editable-profile-avatar";
import { Switch } from "@/shared/ui/toggle-switch/switch";

type Tier = Parameters<typeof TierBadge>[0] extends { tier: infer T }
	? T
	: never;
type Rank = Parameters<typeof TierBadge>[0] extends { rank: infer R }
	? R
	: never;

interface ProfileSummaryCardProps {
	gameName: string;
	tag: string;
	soloTier: Tier;
	soloRank: Rank;
	freeTier: Tier;
	freeRank: Rank;
	gameStyleChips: string[];
	gameStyleAddon?: ReactNode;
	micChecked: boolean;
	variant: "lg" | "sm";
	onMicToggle?: (checked: boolean) => void;
	containerRef?: RefObject<HTMLDivElement | null>;
	className?: string;
}

export default function ProfileSummaryCard({
	gameName,
	tag,
	soloTier,
	soloRank,
	freeTier,
	freeRank,
	gameStyleChips,
	gameStyleAddon,
	micChecked,
	variant,
	onMicToggle,
	className,
}: ProfileSummaryCardProps) {
	return (
		<div
			className={`flex w-full flex-col gap-6 rounded-2xl bg-violet-100 p-6 ${className || ""}`}
		>
			{/* Top: avatar + name */}
			<div className="flex items-center gap-4">
				<EditableProfileAvatar variant={variant} />
				<div className="flex flex-col">
					<p className="bold-20 text-gray-800">{gameName}</p>
					<p className="semibold-14 text-gray-500">#{tag}</p>
				</div>
			</div>

			{/* Ranks */}
			<div className="grid grid-cols-2 gap-4">
				<div className="flex flex-col">
					<span className="semibold-12 mb-1.5 text-gray-800">솔로랭크</span>
					<TierBadge tier={soloTier} rank={soloRank} />
				</div>
				<div className="flex flex-col">
					<span className="semibold-12 mb-1.5 text-gray-800">자유랭크</span>
					<TierBadge tier={freeTier} rank={freeRank} />
				</div>
			</div>

			{/* Divider */}
			<div className="w-full border-gray-400 border-b" />

			{/* Game styles */}
			<div className="flex flex-col gap-3">
				<span className="semibold-12 text-gray-600">게임 스타일</span>
				{gameStyleChips.length ? (
					<ul className="flex flex-wrap gap-2">
						{gameStyleChips.map((chip) => (
							<li
								key={chip}
								className="semibold-14 rounded-full bg-white px-4 py-1.5 text-gray-700"
							>
								{chip}
							</li>
						))}
						{gameStyleAddon ? <li>{gameStyleAddon}</li> : null}
					</ul>
				) : (
					<div className="flex items-center gap-2">
						<span className="medium-14 text-gray-400">
							선택한 게임 스타일이 없어요
						</span>
						{gameStyleAddon}
					</div>
				)}
			</div>

			{/* Mic */}
			<div className="flex items-center gap-4">
				<span className="semibold-14 text-gray-800">마이크</span>
				<Switch checked={micChecked} onCheckedChange={onMicToggle} />
			</div>
		</div>
	);
}
