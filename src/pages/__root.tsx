import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useChatNotifications } from "@/features/chat-notifications";

function RootLayout() {
	useChatNotifications();

	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}

export const Route = createRootRoute({
	component: RootLayout,
});
