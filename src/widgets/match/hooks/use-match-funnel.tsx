import { create } from "zustand";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { useLoginRequiredModalStore } from "@/features/auth";
import type { MyProfileResponse } from "@/shared/api";
import type { OpponentProfilePayload } from "@/widgets/match/lib/matching-types";
import type { FunnelStep } from "../lib/types";

export interface UseMatchFunnelReturn {
	user: MyProfileResponse | null;
	step: FunnelStep;
	type: "BASIC" | "PRECISE" | null;
	gameMode: "FAST" | "SOLO" | "FREE" | "ARAM" | null;
	profile: Partial<MyProfileResponse> | null;
	matchComplete?: {
		role: "sender" | "receiver";
		opponent: OpponentProfilePayload;
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

export const useMatchFunnelStore = create<MatchFunnelStore>((set) => ({
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
	const { data: user, isLoading, isFetching } = useFetchMyInfo();
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
		// 유저 정보 로딩 중이면 아무 동작도 하지 않음 (잘못된 모달 방지)
		if (isLoading || isFetching) {
			return;
		}
		// 실제 비로그인 상태에서만 모달 표출
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
