import { create } from "zustand";
import type { FilterState } from "@/features/board/model/type";

interface BoardFilterStore extends FilterState {
	setFilter: <K extends keyof FilterState>(
		key: K,
		value: FilterState[K],
	) => void;
	resetFilters: () => void;
}

const initialState: FilterState = {
	gameMode: undefined,
	tier: undefined,
	mike: undefined,
	position: undefined,
};

export const useBoardFilterStore = create<BoardFilterStore>((set) => ({
	...initialState,

	setFilter: (key, value) => set({ [key]: value }),
	resetFilters: () => set(initialState),
}));
