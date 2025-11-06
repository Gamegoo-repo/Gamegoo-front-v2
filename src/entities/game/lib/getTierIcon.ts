import type { Tier } from "@/shared/api";
import BronzeIcon from "@/shared/assets/icons/tier/bronze.svg?react";
import ChallengerIcon from "@/shared/assets/icons/tier/challenger.svg?react";
import DiamondIcon from "@/shared/assets/icons/tier/diamond.svg?react";
import EmeraldIcon from "@/shared/assets/icons/tier/emerald.svg?react";
import GoldIcon from "@/shared/assets/icons/tier/gold.svg?react";
import GrandMasterIcon from "@/shared/assets/icons/tier/grandmaster.svg?react";
import IronIcon from "@/shared/assets/icons/tier/iron.svg?react";
import MasterIcon from "@/shared/assets/icons/tier/master.svg?react";
import PlatinumIcon from "@/shared/assets/icons/tier/platinum.svg?react";
import SilverIcon from "@/shared/assets/icons/tier/silver.svg?react";
import UnrankedIcon from "@/shared/assets/icons/tier/unranked.svg?react";

const TIER_ICONS: Record<
	Tier,
	React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
	UNRANKED: UnrankedIcon,
	IRON: IronIcon,
	BRONZE: BronzeIcon,
	SILVER: SilverIcon,
	GOLD: GoldIcon,
	PLATINUM: PlatinumIcon,
	EMERALD: EmeraldIcon,
	DIAMOND: DiamondIcon,
	MASTER: MasterIcon,
	GRANDMASTER: GrandMasterIcon,
	CHALLENGER: ChallengerIcon,
};

export const getTierIcon = (tier: Tier) => {
	return TIER_ICONS[tier];
};
