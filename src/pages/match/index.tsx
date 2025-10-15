import { createFileRoute } from "@tanstack/react-router";
import { MatchComponent } from "@/widgets/match";

export const Route = createFileRoute("/match/")({
	component: MatchComponent,
});
