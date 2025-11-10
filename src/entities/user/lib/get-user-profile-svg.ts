import Character1Icon from "@/shared/assets/characters/character1.svg?react";
import Character2Icon from "@/shared/assets/characters/character2.svg?react";
import Character3Icon from "@/shared/assets/characters/character3.svg?react";
import Character4Icon from "@/shared/assets/characters/character4.svg?react";
import Character5Icon from "@/shared/assets/characters/character5.svg?react";
import Character6Icon from "@/shared/assets/characters/character6.svg?react";
import Character7Icon from "@/shared/assets/characters/character7.svg?react";
import Character8Icon from "@/shared/assets/characters/character8.svg?react";

type CharacterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const PROFILE_SVG: Record<
	CharacterId,
	React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
	1: Character1Icon,
	2: Character2Icon,
	3: Character3Icon,
	4: Character4Icon,
	5: Character5Icon,
	6: Character6Icon,
	7: Character7Icon,
	8: Character8Icon,
};

export const getUserProfileSvg = (id: number) => {
	if (id < 1 || id > 8) return PROFILE_SVG[1];
	return PROFILE_SVG[id as CharacterId];
};
