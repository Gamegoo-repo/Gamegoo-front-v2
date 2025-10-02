import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { ChatSocketProvider } from "@/entities/chat";
import { useRefreshToken } from "@/features/auth";
import { useChatDialogStore } from "@/features/chat/model/store";
import { useChatNotifications } from "@/features/chat/model/use-chat-notification";
import { FloatingChatButton } from "@/features/chat/ui/floating-chat-button";
import FloatingChatDialog from "@/features/chat/ui/floating-chat-dialog";
import { tokenManager } from "@/shared/api/config";
import {
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";

function RootLayout() {
	useChatNotifications();

	const { openDialog } = useChatDialogStore();
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

	return (
		<TanstackQueryProvider>
			<GamegooSocketProvider>
				<ChatSocketProvider>
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
				</ChatSocketProvider>
			</GamegooSocketProvider>
		</TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
