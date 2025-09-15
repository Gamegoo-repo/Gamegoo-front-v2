import { createFileRoute } from "@tanstack/react-router";
import SocketTest from "@/components/SocketTest";
import { Button } from "@/shared/ui/button/ui";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2 space-y-6">
			<div>
				<h3>Welcome Home!</h3>
				<Button>겜구 테스트</Button>
			</div>

			<div className="border-t pt-6">
				<h2 className="text-xl font-bold mb-4">🔌 Socket.IO 연결 테스트</h2>
				<SocketTest />
			</div>
		</div>
	);
}
