import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/mypage/")({
	beforeLoad: () => {
		throw redirect({ to: "/mypage/profile" });
	},
});
