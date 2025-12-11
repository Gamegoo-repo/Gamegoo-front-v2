import type { Term } from "./types";

export const TERMS: Term[] = [
	{ key: "service", label: "이용 약관", required: true, slug: "service" },
	{
		key: "privacy",
		label: "개인정보 처리방침",
		required: true,
		slug: "privacy",
	},
	{
		key: "marketing",
		label: "마케팅 목적 개인정보 수집 및 이용",
		required: false,
		slug: "marketing",
	},
];

export const getTerm = (key: string) => {
	return TERMS.find((term) => term.key === key);
};
