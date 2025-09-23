import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { useChatDialogStore } from "@/features/chat-dialog-controller";
import { useChatNotifications } from "@/features/chat-notifications";
import {
	GamegooSocketProvider,
	TanstackQueryProvider,
} from "@/shared/providers";
import { ChatContent, ChatDialog, ChatTabs } from "@/widgets/chat-dialog";
import { FloatingChatButton } from "@/widgets/floating-chat-button";

function RootLayout() {
	useChatNotifications();

	const { isOpen, openDialog, closeDialog } = useChatDialogStore();
	const [activeTab, setActiveTab] = useState(0);

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
				<ChatDialog isOpen={isOpen} onClose={handleChatDialogClose}>
					<ChatTabs
						tabs={tabs}
						activeTab={activeTab}
						onTabClick={setActiveTab}
					/>
					<ChatContent activeTab={activeTab} />
				</ChatDialog>
				<TanStackRouterDevtools />
			</GamegooSocketProvider>
		</TanstackQueryProvider>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
