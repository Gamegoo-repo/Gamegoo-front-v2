import {
	createRootRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import {
	LoginRequiredModal,
	useLoginRequiredModalStore,
	useRefreshToken,
} from "@/features/auth";
import { useChatroomUpdateHandler } from "@/features/chat/api/use-chatroom-update-handler";
import { tokenManager } from "@/shared/api/config";
import {
	AuthUserProvider,
	ChatSocketProvider,
	ConfirmDialogProvider,
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";
import FloatingChatButton from "@/widgets/floating-chat-dialog/ui/floating-chat-button";
import FloatingChatDialog from "@/widgets/floating-chat-dialog/ui/floating-chat-dialog";

function RootLayout() {
	useChatroomUpdateHandler();

	const { openDialog: openChatDialog } = useChatDialogStore();
	const { openModal: openLoginRequiredModal } = useLoginRequiredModalStore();
	const refreshTokenMutation = useRefreshToken();
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

			console.log("Auth initialization:", {
				accessToken: !!accessToken,
				refreshToken: !!refreshToken,
			});

			// accessToken이 없고 refreshToken이 있을 때만 refresh 시도
			if (!accessToken && refreshToken) {
				try {
					console.log("Attempting token refresh...");
					await refreshTokenMutation.mutateAsync(refreshToken);
					console.log("Token refresh successful");
				} catch (error) {
					console.warn("Token refresh error on app initialization:", error);
					// refresh 실패 시에만 리다이렉트
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
			<GamegooSocketProvider>
				<ChatSocketProvider>
					<ConfirmDialogProvider>
						<AuthUserProvider>
							<div className="p-2 flex gap-2">
								<Link to="/" className="[&.active]:font-bold">
									Home
								</Link>
								<Link to="/about" className="[&.active]:font-bold">
									About
								</Link>
							</div>
							<hr />
							<Outlet />
							<FloatingChatButton onClick={handleChatButtonClick} />
							<FloatingChatDialog />
							<TanStackRouterDevtools />
							<LoginRequiredModal />
						</AuthUserProvider>
					</ConfirmDialogProvider>
				</ChatSocketProvider>
			</GamegooSocketProvider>
		</TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
