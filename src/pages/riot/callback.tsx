import { createFileRoute } from "@tanstack/react-router";
import AuthCallback from "@/widgets/auth/ui/auth-callback";

export const Route = createFileRoute("/riot/callback")({
	component: AuthCallback,
});
