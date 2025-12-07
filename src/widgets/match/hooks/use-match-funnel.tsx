import { create } from "zustand";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { useLoginRequiredModalStore } from "@/features/auth";
import type { MyProfileResponse } from "@/shared/api";
import type { FunnelStep } from "../lib/types";

export interface UseMatchFunnelReturn {
	user: MyProfileResponse | null;
	step: FunnelStep;
	type: "BASIC" | "PRECISE" | null;
	gameMode: "FAST" | "SOLO" | "FREE" | "ARAM" | null;
	profile: Partial<MyProfileResponse> | null;
	matchComplete?: {
		role: "sender" | "receiver";
		opponent: {
			gameName: string;
			tag: string;
			tier: string;
			mainP: string;
			subP: string;
		};
		matchingUuid: string;
	};
	toStep: (
		step: FunnelStep,
		newState?: Partial<
			Pick<
				UseMatchFunnelReturn,
				"type" | "gameMode" | "profile" | "matchComplete"
			>
		>,
	) => void;
}

interface MatchFunnelStore {
	step: FunnelStep;
	type: "BASIC" | "PRECISE" | null;
	gameMode: "FAST" | "SOLO" | "FREE" | "ARAM" | null;
	profile: Partial<MyProfileResponse> | null;
	matchComplete?: UseMatchFunnelReturn["matchComplete"];
	setStep: (
		step: FunnelStep,
		newState?: Partial<Omit<MatchFunnelStore, "setStep">>,
	) => void;
}

const useMatchFunnelStore = create<MatchFunnelStore>((set) => ({
	step: "profile",
	type: "BASIC",
	gameMode: "FAST",
	profile: null,
	matchComplete: undefined,
	setStep: (step, newState) =>
		set((state) => {
			if (!newState) {
				return { ...state, step };
			}
			return { ...state, ...newState, step };
		}),
}));

export const useMatchFunnel = (): UseMatchFunnelReturn => {
	const { data: user } = useFetchMyInfo();
	const { openModal: openLoginRequiredModal } = useLoginRequiredModalStore();

	const { step, type, gameMode, profile, matchComplete, setStep } =
		useMatchFunnelStore();

	const toStep = (
		step: FunnelStep,
		newState?: Partial<
			Pick<
				UseMatchFunnelReturn,
				"type" | "gameMode" | "profile" | "matchComplete"
			>
		>,
	) => {
		if (!user) {
			openLoginRequiredModal();
			return;
		}

		setStep(step, newState);
	};

	return {
		user: user || null,
		step,
		type,
		gameMode,
		profile,
		matchComplete,
		toStep,
	};
};
