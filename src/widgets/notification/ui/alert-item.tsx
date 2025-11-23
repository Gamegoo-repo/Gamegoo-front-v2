import { formatDateSimple } from "@/shared/lib/format-date-simple";
import { cn } from "@/shared/lib/utils";
import NotificationIcon from "./notification-icon";

interface AlertItemProps {
	notificationId: number;
	notificationType: number;
	pageUrl?: string;
	content: string;
	createdAt: string;
	read: boolean;
	onClick: (notificationId: number, pageUrl?: string) => void;
}

export default function AlertItem({
	notificationId,
	notificationType,
	pageUrl,
	content,
	createdAt,
	read,
	onClick,
}: AlertItemProps) {
	const isPenalty = notificationType === 4;

	return (
		<button
			type="button"
			onClick={() => onClick(notificationId, pageUrl)}
			className={cn(
				"w-full text-left rounded-[10px] bg-white px-6 py-8",
				"shadow-[0_0_16.8px_rgba(0,0,0,0.15)] transition-colors",
				read ? "opacity-50" : "hover:bg-gray-50",
			)}
		>
			<div className="flex items-center gap-4">
				<div className="relative min-w-[46px] min-h-[46px]">
					<NotificationIcon
						type={notificationType}
						className="absolute left-0 top-0 h-[46px] w-[46px]"
					/>
					{!read && (
						<span
							className={cn(
								"absolute right-[1px] top-[1px] h-[10px] w-[10px] rounded-full",
								isPenalty ? "bg-red-600" : "bg-violet-600",
							)}
						/>
					)}
				</div>
				<div className="flex flex-1 flex-col items-start justify-between">
					<p className="text-gray-800 semibold-18">
						{isPenalty ? "신고 및 제재 조치" : content}
					</p>
					<span className="mt-1 regular-16 text-gray-500">
						{formatDateSimple(createdAt)}
					</span>
				</div>
			</div>
		</button>
	);
}
