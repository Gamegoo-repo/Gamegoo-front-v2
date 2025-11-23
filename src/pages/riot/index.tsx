import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/shared/model/use-auth";
import AuthSection from "@/widgets/auth/ui/auth-section";

function AuthPage() {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate({ to: "/" });
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<AuthSection />
		</div>
	);
}

export const Route = createFileRoute("/riot/")({
	component: AuthPage,
});
