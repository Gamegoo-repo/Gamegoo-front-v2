import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/mypage/blocked")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="w-full h-full">My Page - Blocked</div>;
}
