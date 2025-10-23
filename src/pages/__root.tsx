import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import { useRefreshToken } from "@/features/auth";
import { useChatDialogStore } from "@/features/chat-dialog-controller";
import { useChatNotifications } from "@/features/chat-notifications";

import { tokenManager } from "@/shared/api/config";
import {
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";
import { ChatContent, ChatDialog, ChatTabs } from "@/widgets/chat-dialog";
import { FloatingChatButton } from "@/widgets/floating-chat-button";
import { ResponsiveProvider } from "@/shared/model/responsive-context";

function RootLayout() {
	useChatNotifications();

	const { isOpen, openDialog, closeDialog } = useChatDialogStore();
	const [activeTab, setActiveTab] = useState(0);
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

	const tabs = ["친구 목록", "채팅방"];

	return (
		<TanstackQueryProvider>
			<GamegooSocketProvider>
				<ResponsiveProvider>
					<Outlet />
					<FloatingChatButton onClick={handleChatButtonClick} />
					<ChatDialog isOpen={isOpen} onClose={handleChatDialogClose}>
						<ChatTabs
							tabs={tabs}
							activeTab={activeTab}
							onTabClick={setActiveTab}
						/>
						<ChatContent activeTab={activeTab} />
					</ChatDialog>
					<TanStackRouterDevtools />
				</ResponsiveProvider>
			</GamegooSocketProvider>
		</TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
