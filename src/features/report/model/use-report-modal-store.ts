import type { ReportPath } from "@/shared/api";
import { create } from "zustand";

interface ReportModalStore {
	path: ReportPath | undefined;
	selectedPostId: number | undefined;
	userId: number | undefined;

	openModal: (path: ReportPath, userId: number, postId?: number) => void;
	closeModal: () => void;
}

export const useReportModalStore = create<ReportModalStore>((set, _get) => ({
	path: undefined,
	selectedPostId: undefined,
	userId: undefined,

	openModal: (path, userId, postId) => {
		if (!path) return;

		if (path === "BOARD") {
			set({
				path,
				userId,
				selectedPostId: postId,
			});
		} else {
			set({
				path,
				userId,
			});
		}
	},

	closeModal: () => {
		set({
			path: undefined,
			selectedPostId: undefined,
			userId: undefined,
		});
	},
}));
