import { createFileRoute } from "@tanstack/react-router";
import AuthCallback from "@/pages/auth/ui/AuthCallback";

export const Route = createFileRoute("/riot/callback")({
	component: AuthCallback,
});
