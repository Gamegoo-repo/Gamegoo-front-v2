import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { useRefreshToken } from "@/features/auth";
import { useChatDialogStore } from "@/features/chat-dialog-controller";
import { useChatNotifications } from "@/features/chat-notifications";
import { tokenManager } from "@/shared/api/config";
import {
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";
import { ChatDialog } from "@/widgets/chat-dialog";
import { FloatingChatButton } from "@/widgets/floating-chat-button";

function RootLayout() {
	useChatNotifications();

	const { isOpen, openDialog, closeDialog } = useChatDialogStore();
	const refreshTokenMutation = useRefreshToken();

	useEffect(() => {
		const initializeAuth = async () => {
			const accessToken = tokenManager.getAccessToken();
			const refreshToken = tokenManager.getRefreshToken();

			if (!accessToken && refreshToken) {
				try {
					await refreshTokenMutation.mutateAsync(refreshToken);
				} catch (error) {
					console.warn("Token refresh error on app initialization:", error);
				}
			}
		};

		initializeAuth();
	}, []);

	const handleChatButtonClick = () => {
		openDialog();
	};

	const handleChatDialogClose = () => {
		closeDialog();
	};

	return (
		<TanstackQueryProvider>
			<GamegooSocketProvider>
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
				<ChatDialog isOpen={isOpen} onClose={handleChatDialogClose} />
				<TanStackRouterDevtools />
			</GamegooSocketProvider>
		</TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
