import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { notificationKeys } from "@/features/notification/api/query-keys";
import { api } from "@/shared/api";
import {
	mediaQueries,
	useMediaQuery,
} from "@/shared/model/use-media-query.tsx";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox.tsx";
import { FlexBox } from "@/shared/ui/flexbox/flexbox.tsx";
import { Button } from "@/shared/ui/index.ts";
import Modal from "@/shared/ui/modal/modal.tsx";
import type { NotificationSearch } from "../lib/types";
import AlertItem from "./alert-item.tsx";
import NotificationPagination from "./notification-pagination.tsx";

export default function NotificationComponent() {
	const queryClient = useQueryClient();

	const isMobile = useMediaQuery(mediaQueries.isMobile);

	const fontClass = isMobile ? "medium-14" : "regular-25";

	const [checked, setChecked] = useState<Set<number>>(new Set());
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [actionState, setActionState] = useState<"read" | "delete" | null>(
		null,
	);

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
		if (checked.size >= 2) {
			setActionState("read");
			return setIsOpenModal(true);
		}

		readMultipleMutation.mutate(Array.from(checked));
	}, [checked, readMultipleMutation]);

	const handleDeleteSelected = useCallback(() => {
		if (!checked.size) return;
		if (checked.size >= 2) {
			setActionState("delete");
			return setIsOpenModal(true);
		}
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

	const renderModalDescription = () => {
		if (!actionState) return;
		const isAll = checked.size === allIds.length;

		if (actionState === "read")
			return isAll ? (
				<span className={`text-gray-900 ${fontClass}`}>
					모든 알림을 읽음 처리할까요?
				</span>
			) : (
				<span className={`text-gray-900 ${fontClass}`}>
					선택한 알림을 읽음 처리할까요?
				</span>
			);

		if (actionState === "delete")
			return (
				<FlexBox direction="column" align="center" justify="center">
					<span className={`text-gray-900 ${fontClass}`}>
						{isAll ? "모든  알림을 삭제할까요?" : "선택한 알림을 삭제할까요?"}
					</span>
					<span className={`text-gray-900 ${fontClass}`}>
						삭제된 알림은 복구할 수 없습니다.
					</span>
				</FlexBox>
			);

		return null;
	};

	const handleConfirmModal = useCallback(() => {
		const ids = Array.from(checked);

		if (actionState === "read") {
			readMultipleMutation.mutate(ids);
		}

		if (actionState === "delete") {
			deleteMutation.mutate(ids);
		}

		setIsOpenModal(false);
		setActionState(null);
	}, [checked, actionState]);

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
			<Modal
				isOpen={isOpenModal}
				onClose={() => {
					setIsOpenModal(false);
					setActionState(null);
				}}
				className="w-[320px] h-[177px] md:w-[540px] md:h-[268px] p-0 mobile:p-0"
			>
				<FlexBox direction="column" align="center" fullHeight>
					<FlexBox align="center" fullHeight>
						{renderModalDescription()}
					</FlexBox>
					<footer className="w-full border-t border-gray-400">
						<FlexBox direction="row" align="center" justify="between" fullWidth>
							<Button
								variant="ghost"
								className="flex-1 py-[26px] border-r border-gray-400 rounded-none"
								onClick={() => {
									setIsOpenModal(false);
									setActionState(null);
								}}
							>
								취소
							</Button>
							<Button
								variant="ghost"
								className="flex-1 py-[26px]"
								onClick={handleConfirmModal}
							>
								{actionState === "read" ? (
									<span className="text-violet-600">확인</span>
								) : (
									<span className="text-red-600">삭제</span>
								)}
							</Button>
						</FlexBox>
					</footer>
				</FlexBox>
			</Modal>
		</div>
	);
}
