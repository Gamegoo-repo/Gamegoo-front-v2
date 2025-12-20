import { create } from "zustand";
import type { SystemData } from "@/features/chat";
import type { ChatroomResponse } from "@/shared/api";

export const CHAT_DIALOG_TABS = [
	"friend-list",
	"chatroom-list",
	"chatroom",
] as const;

export type ChatDialogType = (typeof CHAT_DIALOG_TABS)[number];

export interface ChatDialogState {
	isOpen: boolean;
	chatDialogType: ChatDialogType;
	chatroom: ChatroomResponse | null;
	systemData?: SystemData;
	isMannerModalOpen: boolean;
	mannerModalType?: "manner" | "badManner";
	openDialog: () => void;
	closeDialog: () => void;
	toggleDialog: () => void;
	setChatDialogType: (type: ChatDialogType) => void;
	setChatroom: (chatroom: ChatroomResponse) => void;
	setSystemData: (system: SystemData | undefined) => void;
	clearSystemData: () => void;
	openMannerModal: (type: "manner" | "badManner") => void;
	closeMannerModal: () => void;
}

export const useChatDialogStore = create<ChatDialogState>((set) => ({
	isOpen: false,
	chatDialogType: "friend-list",
	chatroom: null,
	systemData: undefined,
	isMannerModalOpen: false,
	mannerModalType: undefined,
	openDialog: () => set({ isOpen: true }),
	closeDialog: () => set({ isOpen: false }),
	toggleDialog: () => set((state) => ({ isOpen: !state.isOpen })),
	setChatDialogType: (chatDialogType: ChatDialogType) =>
		set({ chatDialogType }),
	setChatroom: (chatroom: ChatroomResponse) => set({ chatroom }),
	setSystemData: (system: SystemData | undefined) =>
		set({ systemData: system }),
	clearSystemData: () => set({ systemData: undefined }),
	openMannerModal: (type: "manner" | "badManner") =>
		set({ isMannerModalOpen: true, mannerModalType: type }),
	closeMannerModal: () =>
		set({ isMannerModalOpen: false, mannerModalType: undefined }),
}));
