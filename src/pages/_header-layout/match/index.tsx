import { createFileRoute } from "@tanstack/react-router";
import { MatchComponent } from "@/widgets/match";

export const Route = createFileRoute("/_header-layout/match/")({
	component: MatchComponent,
});
