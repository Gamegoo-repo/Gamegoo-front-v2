import type { AxiosError } from "axios";
import { create } from "zustand";

type State = {
	appError: AxiosError | null;
};

type Action = {
	updateAppError: (appError: State["appError"]) => void;
};

export const useAppErrorStore = create<State & Action>((set) => ({
	appError: null,
	updateAppError: (appError) => set(() => ({ appError })),
}));
