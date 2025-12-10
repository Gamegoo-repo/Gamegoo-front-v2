import { create } from "zustand";
import type { TermKey } from "@/entities/term/model";

interface TermsDetailModalState {
	isOpen: boolean;
	openModal: (t: TermKey | null) => void;
	closeModal: () => void;
	type: TermKey | null;
}

export const useTermsDetailModalStore = create<TermsDetailModalState>(
	(set) => ({
		isOpen: false,
		openModal: (newType) => set({ isOpen: true, type: newType }),
		closeModal: () => set({ isOpen: false, type: null }),
		type: null,
	}),
);
