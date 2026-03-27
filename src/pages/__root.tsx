import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { GlobalBoardModals } from "@/app/providers/global-board-modals";
import { GoogleAnalyticsTracker } from "@/app/providers/google-analytics-tracker";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import {
	LoginRequiredModal,
	useLoginRequiredModalStore,
} from "@/features/auth";
import { useLogoutAlertModalState } from "@/features/auth/model/logout-alert-modal-store";
import LogoutAlertModal from "@/features/auth/ui/logout-alert-modal";
import PostDeletedAlertModal from "@/features/board/ui/post-deleted-alert-modal";
import { useChatroomUpdateHandler } from "@/features/chat/api/use-chatroom-update-handler";
import ReportModal from "@/features/report/ui/report-modal";
import { tokenManager } from "@/shared/api";
import { ResponsiveProvider } from "@/shared/model/responsive-context";
import { useAuth } from "@/shared/model/use-auth";
import {
	ChatSocketProvider,
	ConfirmDialogProvider,
	GamegooSocketProvider,
} from "@/shared/providers";
import { DesignSystemProvider } from "@gamegoo-ui/design-system";
import { MatchGlobalListenerProvider } from "@/shared/providers/match-global-listener-provider";
import {
	FloatingChatButton,
	FloatingChatDialog,
} from "@/widgets/floating-chat-dialog";
import { FloatingMatchingCard } from "@/widgets/match/ui/floating-matching-card/floating-matching-card";
import Page404Component from "@/widgets/page-404-component";

function RootLayout() {
	useChatroomUpdateHandler();

	const { openDialog: openChatDialog } = useChatDialogStore();
	const { openModal: openLogoutAlertModal } = useLogoutAlertModalState();
	const { openModal: openLoginRequiredModal } = useLoginRequiredModalStore();

	const { initializeAuth } = useAuth();

	useEffect(() => {
		initializeAuth();

		// token refresh 실패 시 logout-alert-modal 열기
		tokenManager.setOnRefreshFailed(() => {
			openLogoutAlertModal();
		});

		return () => {
			tokenManager.setOnRefreshFailed(null);
		};
	}, [openLogoutAlertModal]);

	const handleChatButtonClick = () => {
		if (!tokenManager.getRefreshToken()) {
			openLoginRequiredModal();
			return;
		}
		openChatDialog();
	};

	return (
		<DesignSystemProvider>
			<GamegooSocketProvider>
				<ChatSocketProvider>
					<ConfirmDialogProvider>
						<ResponsiveProvider>
							<GoogleAnalyticsTracker />
							<MatchGlobalListenerProvider />
							<Outlet />
							<FloatingChatButton onClick={handleChatButtonClick} />
							<FloatingChatDialog />
							<FloatingMatchingCard />
							<LoginRequiredModal />
							<LogoutAlertModal />
							<PostDeletedAlertModal />
							<ReportModal />
							<GlobalBoardModals />
							<TanStackRouterDevtools />
						</ResponsiveProvider>
					</ConfirmDialogProvider>
				</ChatSocketProvider>
			</GamegooSocketProvider>
		</DesignSystemProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: () => <Page404Component />,
});
