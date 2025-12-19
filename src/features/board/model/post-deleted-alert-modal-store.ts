import { create } from "zustand";

interface PostDeletedAlertModal {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

export const usePostDeletedAlertModalState = create<PostDeletedAlertModal>(
	(set) => ({
		isOpen: false,
		openModal: () => set({ isOpen: true }),
		closeModal: () => set({ isOpen: false }),
	}),
);
