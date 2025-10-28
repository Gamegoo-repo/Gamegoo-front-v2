import { BAD_MANNER_TYPES, MANNER_TYPES } from "../config/manner.types";

export const getMannerText = (id: number) => {
	if (id >= 1 && id <= 6) {
		return MANNER_TYPES.find((item) => item.id === id)?.text;
	} else if (6 < id && id <= 12) {
		return BAD_MANNER_TYPES.find((item) => item.id === id)?.text;
	}
};
