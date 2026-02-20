import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { notificationKeys } from "@/features/notification/api/query-keys";
import { api } from "@/shared/api";
import type { NotificationSearch } from "../lib/types";
import AlertItem from "./alert-item.tsx";
import NotificationPagination from "./notification-pagination.tsx";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox.tsx";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/shared/ui/index.ts";

export default function NotificationComponent() {
	const queryClient = useQueryClient();

	const [checked, setChecked] = useState<Set<number>>(new Set());

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
			await queryClient.invalidateQueries({
				queryKey: notificationKeys.unreadCount(),
			});
		},
	});

	const readMultipleMutation = useMutation({
		mutationFn: async (ids: number[]) => {
			const { data } = await api.private.notification.readMultipleNotifications(
				{
					notificationIds: ids,
				},
			);
			return data;
		},
		onSuccess: async () => {
			setChecked(new Set());

			await queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});

			await queryClient.invalidateQueries({
				queryKey: notificationKeys.unreadCount(),
			});
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (ids: number[]) => {
			const { data } =
				await api.private.notification.deleteMultipleNotifications({
					notificationIds: ids,
				});
			return data;
		},
		onSuccess: async () => {
			setChecked(new Set());

			await queryClient.invalidateQueries({
				queryKey: ["notifications"],
			});

			await queryClient.invalidateQueries({
				queryKey: notificationKeys.unreadCount(),
			});
		},
	});

	const handleReadSelected = useCallback(() => {
		if (!checked.size) return;
		readMultipleMutation.mutate(Array.from(checked));
	}, [checked, readMultipleMutation]);

	const handleDeleteSelected = useCallback(() => {
		if (!checked.size) return;
		deleteMutation.mutate(Array.from(checked));
	}, [checked, deleteMutation]);

	const handleItemClick = useCallback(
		async (notificationId: number, pageUrl?: string) => {
			// 읽음 처리
			if (notificationId) {
				await readMutation.mutateAsync(notificationId);
			}

			if (pageUrl) {
				// 내부/외부 경로 모두 안전하게 이동
				window.location.href = pageUrl;
			}
		},
		[readMutation],
	);

	const allIds = data?.notificationList.map((n) => n.notificationId) ?? [];

	const isAllChecked =
		allIds.length > 0 && allIds.every((id) => checked.has(id));

	const handleCheckedAll = useCallback(() => {
		setChecked((prev) => {
			const isAllSelected = allIds.every((id) => prev.has(id));
			if (isAllSelected) return new Set();
			return new Set(allIds);
		});
	}, [allIds]);

	const handleChangeCheckedValue = useCallback((id: number) => {
		setChecked((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else next.add(id);
			return next;
		});
	}, []);

	useEffect(() => {
		setChecked(new Set());
	}, [page]);

	return (
		<div className="h-full w-full">
			<h2 className="bold-25 mb-8 border-gray-200 border-b pb-4">알림</h2>

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
						<header className="flex items-center gap-5 pl-3">
							<Checkbox
								isChecked={isAllChecked}
								onCheckedChange={handleCheckedAll}
							/>
							<Button
								className="p-0"
								variant="ghost"
								onClick={handleReadSelected}
								disabled={!checked.size}
							>
								<span className="semibold-18">읽음</span>
							</Button>

							<Button
								className="p-0"
								variant="ghost"
								onClick={handleDeleteSelected}
								disabled={!checked.size}
							>
								<span className="semibold-18">삭제</span>
							</Button>
						</header>
						<ul className="mt-6 mb-8 flex w-full flex-col gap-3">
							{data.notificationList.map((n) => (
								<li key={n.notificationId}>
									<AlertItem
										notificationId={n.notificationId}
										notificationType={n.notificationType}
										content={n.content}
										createdAt={n.createdAt}
										read={n.read}
										pageUrl={n.pageUrl}
										isChecked={checked.has(n.notificationId)}
										onChangeCheckedValue={handleChangeCheckedValue}
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
