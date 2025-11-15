import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import { useChatDialogStore } from "@/entities/chat/store/use-chat-dialog-store";
import { useChatroomUpdateHandler } from "@/features/chat/api/use-chatroom-update-handler";
import { ResponsiveProvider } from "@/shared/model/responsive-context";
import { useAuth } from "@/shared/model/use-auth";
import {
	ChatSocketProvider,
	ConfirmDialogProvider,
	GamegooSocketProvider,
} from "@/shared/providers";
import {
	FloatingChatButton,
	FloatingChatDialog,
} from "@/widgets/floating-chat-dialog";

function RootLayout() {
	useChatroomUpdateHandler();

	const { openDialog } = useChatDialogStore();
	const { initializeAuth } = useAuth();

	const navigate = useNavigate();

	useEffect(() => {
		initializeAuth();
	}, []);

	const handleChatButtonClick = () => {
		openDialog();
	};

	return (
		// <TanstackQueryProvider>
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
		// </TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
