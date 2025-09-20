import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import * as z from "zod";
import SignUpSection from "@/widgets/auth/ui/sign-up-section";

const puuidSearchSchema = z.object({
	puuid: z.string().optional(),
});

export const Route = createFileRoute("/sign-up/terms")({
	validateSearch: (search) => puuidSearchSchema.parse(search),
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { puuid } = Route.useSearch();

	useEffect(() => {
		if (!puuid || puuid.trim() === "") {
			navigate({ to: "/riot" });
		}
	}, [puuid, navigate]);

	if (!puuid || puuid.trim() === "") {
		return <div>리다이렉트 중...</div>;
	}

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<SignUpSection puuid={puuid} />
		</div>
	);
}
