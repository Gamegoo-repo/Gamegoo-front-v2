import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { useLoginRequiredModalStore } from "@/features/auth";
import { useChatroomUpdateHandler } from "@/features/chat/api/use-chatroom-update-handler";
import { tokenManager } from "@/shared/api/config";
import { ResponsiveProvider } from "@/shared/model/responsive-context";
import {
	AuthUserProvider,
	ChatSocketProvider,
	ConfirmDialogProvider,
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";

import {
	FloatingChatButton,
	FloatingChatDialog,
} from "@/widgets/floating-chat-dialog";

function RootLayout() {
	useChatroomUpdateHandler();

	const { openDialog: openChatDialog } = useChatDialogStore();
	const { openModal: openLoginRequiredModal } = useLoginRequiredModalStore();
	const navigate = useNavigate();

	useEffect(() => {
		let isInitialized = false;

		const initializeAuth = async () => {
			if (isInitialized) return;
			isInitialized = true;

			// 이미 로그인 페이지에 있으면 리다이렉트하지 않음
			if (
				typeof window !== "undefined" &&
				window.location.pathname === "/riot"
			) {
				return;
			}

			const accessToken = tokenManager.getAccessToken();
			const refreshToken = tokenManager.getRefreshToken();

			// accessToken이 없고 refreshToken이 있을 때만 refresh 시도
			if (!accessToken && refreshToken) {
				try {
					await tokenManager.refreshToken();
				} catch (_error) {
					tokenManager.clearTokens();
					navigate({ to: "/riot" });
				}
			}
		};

		initializeAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChatButtonClick = () => {
		if (!tokenManager.getRefreshToken()) {
			openLoginRequiredModal();
			return;
		}
		openChatDialog();
	};

	return (
		<TanstackQueryProvider>
			<AuthUserProvider>
				<GamegooSocketProvider>
					<ChatSocketProvider>
						<ConfirmDialogProvider>
							<ResponsiveProvider>
								<Outlet />
								<FloatingChatButton onClick={handleChatButtonClick} />
								<FloatingChatDialog />
								<TanStackRouterDevtools />
							</ResponsiveProvider>
						</ConfirmDialogProvider>
					</ChatSocketProvider>
				</GamegooSocketProvider>
			</AuthUserProvider>
		</TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
