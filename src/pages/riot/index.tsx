import { createFileRoute } from "@tanstack/react-router";
import AuthSection from "@/widgets/auth/ui/AuthSection";

const AuthPage = () => {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<AuthSection />
		</div>
	);
};

export const Route = createFileRoute("/riot/")({
	component: AuthPage,
});
