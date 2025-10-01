import { create } from "zustand";

export const CHAT_DIALOG_TABS = [
	"friend-list",
	"chatroom-list",
	"chatroom",
] as const;

export type ChatDialogType = (typeof CHAT_DIALOG_TABS)[number];

export interface ChatDialogState {
	isOpen: boolean;
	chatDialogType: ChatDialogType;
	openDialog: () => void;
	closeDialog: () => void;
	toggleDialog: () => void;
	setChatDialogType: (type: ChatDialogType) => void;
}

export const useChatDialogStore = create<ChatDialogState>((set) => ({
	isOpen: false,
	chatDialogType: "friend-list",
	openDialog: () => set({ isOpen: true }),
	closeDialog: () => set({ isOpen: false }),
	toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
	setChatDialogType: (chatDialogType: ChatDialogType) =>
		set({ chatDialogType }),
}));
