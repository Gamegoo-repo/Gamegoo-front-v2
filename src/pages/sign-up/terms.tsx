import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";
import SignUpSection from "@/widgets/auth/ui/sign-up-section";
import TermsDetailModal from "@/features/auth/ui/terms-detail-modal";

const puuidSearchSchema = z.object({
	puuid: z.string().min(1),
});

export const Route = createFileRoute("/sign-up/terms")({
	validateSearch: (search) => puuidSearchSchema.parse(search),
	beforeLoad: ({ search }) => {
		if (!search.puuid || search.puuid.trim() === "") {
			throw redirect({ to: "/riot" });
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { puuid } = Route.useSearch();

	return (
		<>
			<TermsDetailModal />
			<div className="flex h-screen w-screen items-center justify-center">
				<SignUpSection puuid={puuid} />
			</div>
		</>
	);
}
