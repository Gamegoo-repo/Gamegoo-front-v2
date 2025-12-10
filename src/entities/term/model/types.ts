export type TermKey = "service" | "privacy" | "marketing";

export interface Term {
	key: TermKey;
	label: string;
	required: boolean;
	slug: string;
}
