import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/match")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/matching"!</div>;
}
