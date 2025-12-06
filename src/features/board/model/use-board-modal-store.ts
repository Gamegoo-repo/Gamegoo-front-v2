import { create } from "zustand";

type ModalType = "detail" | "create" | "edit" | null;

interface BoardModalStore {
	activeModal: ModalType;
	selectedPostId: number | null;

	openDetailModal: (postId: number) => void;
	openCreateModal: () => void;
	// openEditModal: (postId: number, data: BoardFormData) => void;
	openEditModal: (postId: number) => void;
	closeModal: () => void;

	isDetailOpen: () => boolean;
	isCreateOpen: () => boolean;
	isEditOpen: () => boolean;
}

export const useBoardModalStore = create<BoardModalStore>((set, get) => ({
    activeModal: null,
    selectedPostId: null,

	openDetailModal: (postId) => {
		set({
			activeModal: "detail",
			selectedPostId: postId,
		});
	},

	openCreateModal: () => {
		set({
			activeModal: "create",
			selectedPostId: null,
		});
	},

	openEditModal: (postId) => {
		set({
			activeModal: "edit",
			selectedPostId: postId,
		});
	},

	closeModal: () => {
		set({
			activeModal: null,
			selectedPostId: null,
		});
	},

	isDetailOpen: () => get().activeModal === "detail",
	isCreateOpen: () => get().activeModal === "create",
	isEditOpen: () => get().activeModal === "edit",
}));
