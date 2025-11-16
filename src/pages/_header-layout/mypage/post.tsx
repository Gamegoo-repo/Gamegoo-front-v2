import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/mypage/post")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="w-full h-full">My Page - Post</div>;
}
