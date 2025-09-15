import { createFileRoute } from "@tanstack/react-router";
import SignUpSection from "@/widgets/auth/ui/sign-up-section";

export const Route = createFileRoute("/join/terms")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SignUpSection />;
}
