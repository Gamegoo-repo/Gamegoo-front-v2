import type { ReactNode } from "react";
import type { Position } from "@/shared/api";
import AdcIcon from "../ui/game-icon/adc-icon";
import { AnyIcon } from "../ui/game-icon/any-icon";
import JungleIcon from "../ui/game-icon/jungle-icon";
import MidIcon from "../ui/game-icon/mid-icon";
import SupIcon from "../ui/game-icon/sup-icon";
import TopIcon from "../ui/game-icon/top-icon";

type PositionIconFn = ({
	isSelected,
}: {
	className?: string | undefined;
	isSelected?: boolean | undefined;
}) => ReactNode;

export const POSITION_ICONS: Record<
	Position,
	// React.FunctionComponent<React.SVGProps<SVGSVGElement>>
	PositionIconFn
> = {
	ANY: AnyIcon,
	TOP: TopIcon,
	JUNGLE: JungleIcon,
	MID: MidIcon,
	ADC: AdcIcon,
	SUP: SupIcon,
};

export const getPositionIcon = (position: Position) => {
	return POSITION_ICONS[position];
};
