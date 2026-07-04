import { create } from "zustand";

interface LoginRequiredModalState {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

export const useLoginRequiredModalStore = create<LoginRequiredModalState>(
	(set) => ({
		isOpen: false,
		openModal: () => set({ isOpen: true }),
		closeModal: () => set({ isOpen: false }),
	}),
);
