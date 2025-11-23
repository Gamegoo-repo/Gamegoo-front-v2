import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "@/shared/lib/@generated/routeTree.gen";
import "@/shared/lib/globals.css";
import { ErrorCatcher } from "./shared/ui/error-boundary/error-catcher";
import QueryClientBoundary from "./shared/ui/error-boundary/query-client-boundary";
import UnPredictableErrorBoundary from "./shared/ui/error-boundary/unpredictable-error-boundary";
import ToastContainer from "./shared/ui/toast/toast-container";

const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<UnPredictableErrorBoundary>
				<ErrorCatcher>
					<QueryClientBoundary>
						<ToastContainer />
						<RouterProvider router={router} />
					</QueryClientBoundary>
				</ErrorCatcher>
			</UnPredictableErrorBoundary>
		</StrictMode>,
	);
}
