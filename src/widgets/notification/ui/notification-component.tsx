import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { api } from "@/shared/api";
import type { NotificationSearch } from "../lib/types";
import AlertItem from "./alert-item.tsx";
import NotificationPagination from "./notification-pagination.tsx";

export default function NotificationComponent() {
	const queryClient = useQueryClient();

	const { page = 1 } = useSearch({
		from: "/_header-layout/mypage/notification",
	}) as NotificationSearch;

	const { data, isLoading, isError } = useQuery({
		queryKey: ["notifications", page],
		queryFn: async () => {
			const { data } =
				await api.private.notification.getNotificationListByPage(page);
			return data.data;
		},
	});

	const readMutation = useMutation({
		mutationFn: async (notificationId: number) => {
			const { data } =
				await api.private.notification.readNotification(notificationId);
			return data.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});
		},
	});

	const handleItemClick = async (notificationId: number, pageUrl?: string) => {
		// 이동
		if (pageUrl) {
			// 내부/외부 경로 모두 안전하게 이동
			window.location.href = pageUrl;
		}
		// 읽음 처리
		if (notificationId) {
			readMutation.mutate(notificationId);
		}
	};

	return (
		<div className="w-full h-full">
			<h2 className="bold-25 mb-4 border-b border-gray-200 pb-4">알림</h2>

			{isLoading && (
				<div className="flex h-[300px] items-center justify-center text-gray-500">
					불러오는 중...
				</div>
			)}

			{isError && (
				<div className="flex h-[300px] items-center justify-center text-red-500">
					알림을 불러오지 못했습니다.
				</div>
			)}

			{!isLoading &&
				!isError &&
				data &&
				(data.notificationList.length > 0 ? (
					<>
						<ul className="flex w-full flex-col gap-3 mt-4 mb-8">
							{data.notificationList.map((n) => (
								<li key={n.notificationId}>
									<AlertItem
										notificationId={n.notificationId}
										notificationType={n.notificationType}
										content={n.content}
										createdAt={n.createdAt}
										read={n.read}
										pageUrl={n.pageUrl}
										onClick={handleItemClick}
									/>
								</li>
							))}
						</ul>

						<NotificationPagination totalPages={data.totalPage} />
					</>
				) : (
					<div className="flex min-h-[300px] items-center justify-center text-gray-500">
						새로운 알림이 없습니다.
					</div>
				))}
		</div>
	);
}
