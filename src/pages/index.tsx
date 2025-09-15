import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../shared/ui/button/ui";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<Button>겜구 테스트</Button>
		</div>
	);
}
