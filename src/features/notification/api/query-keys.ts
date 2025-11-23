export const notificationKeys = {
	all: ["notification"] as const,
	unreadCount: () => [...notificationKeys.all, "unread", "count"] as const,
} as const;
