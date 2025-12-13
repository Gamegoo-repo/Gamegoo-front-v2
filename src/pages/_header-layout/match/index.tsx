import { createFileRoute, redirect } from "@tanstack/react-router";
import { useLoginRequiredModalStore } from "@/features/auth";
import { tokenManager } from "@/shared/api";
import { MatchComponent } from "@/widgets/match";

export const Route = createFileRoute("/_header-layout/match/")({
	beforeLoad: () => {
		// 토큰이 없으면 모달을 띄우고 이동을 막음
		const access = tokenManager.getAccessToken();
		const refresh = tokenManager.getRefreshToken();
		if (!access && !refresh) {
			useLoginRequiredModalStore.getState().openModal();
			throw redirect({
				to: "/",
				replace: true,
			});
		}
		return {};
	},
	component: MatchComponent,
});
