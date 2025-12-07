import { create } from "zustand";

interface LogoutAlertModalState {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

export const useLogoutAlertModalState = create<LogoutAlertModalState>(
	(set) => ({
		isOpen: false,
		openModal: () => set({ isOpen: true }),
		closeModal: () => set({ isOpen: false }),
	}),
);
