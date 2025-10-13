import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { useRefreshToken } from "@/features/auth";
import { useChatroomUpdateHandler } from "@/features/chat/api/use-chatroom-update-handler";
import { tokenManager } from "@/shared/api/config";
import {
	ChatSocketProvider,
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";
import { useChatDialogStore } from "@/widgets/floating-chat-dialog/store/use-chat-dialog-store";
import FloatingChatButton from "@/widgets/floating-chat-dialog/ui/floating-chat-button";
import FloatingChatDialog from "@/widgets/floating-chat-dialog/ui/floating-chat-dialog";

function RootLayout() {
	useChatroomUpdateHandler();

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
