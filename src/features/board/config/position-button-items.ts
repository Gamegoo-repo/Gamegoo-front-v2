import { POSITION_ICONS } from "@/entities/game/lib/getPositionIcon";
import type { Position } from "@/shared/api";

type PositionButtonItem = {
	position: Position;
	icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

export const POSITION_BUTTON_ITEMS: PositionButtonItem[] = [
	{ position: "ANY", icon: POSITION_ICONS.ANY },
	{ position: "TOP", icon: POSITION_ICONS.TOP },
	{ position: "JUNGLE", icon: POSITION_ICONS.JUNGLE },
	{ position: "MID", icon: POSITION_ICONS.MID },
	{ position: "ADC", icon: POSITION_ICONS.ADC },
	{ position: "SUP", icon: POSITION_ICONS.SUP },
];
