import { createFileRoute } from "@tanstack/react-router";
import NotificationComponent from "@/widgets/notification/ui/notification-component";

export const Route = createFileRoute("/_header-layout/mypage/notification")({
	component: NotificationComponent,
});
