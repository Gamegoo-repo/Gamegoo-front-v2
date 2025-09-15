import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useChatNotifications } from "@/features/chat-notifications";
import { FloatingChatButton } from "@/widgets/floating-chat-button";

function RootLayout() {
	useChatNotifications();

	const handleChatButtonClick = () => {
		console.log("Chat button clicked!");
	};

	return (
		<>
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
			<TanStackRouterDevtools />
		</>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
