import { create } from "zustand";

interface MatchUiState {
	isMatching: boolean;
	sessionId: number;
	timeLeft: number;

	// void
	start: (sessionId: number, timeLeft: number) => void;
	tick: (timeLeft: number) => void;
	stop: () => void;
}

export const useMatchUiStore = create<MatchUiState>((set) => ({
	isMatching: false,
	sessionId: 0,
	timeLeft: 0,

	// void
	start: (sessionId, timeLeft) =>
		set({ isMatching: true, sessionId, timeLeft }),
	tick: (timeLeft) => set({ timeLeft }),
	stop: () => set({ isMatching: false, sessionId: 0, timeLeft: 0 }),
}));
