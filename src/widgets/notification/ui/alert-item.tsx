import { formatDateSimple } from "@/shared/lib/format-date-simple";
import { cn } from "@/shared/lib/utils";
import NotificationIcon from "./notification-icon";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";

interface AlertItemProps {
	notificationId: number;
	notificationType: number;
	pageUrl?: string;
	content: string;
	createdAt: string;
	read: boolean;
	isChecked: boolean;
	onChangeCheckedValue: (id: number) => void;
	onClick: (notificationId: number, pageUrl?: string) => void;
}

export default function AlertItem({
	notificationId,
	notificationType,
	pageUrl,
	content,
	createdAt,
	read,
	isChecked,
	onChangeCheckedValue,
	onClick,
}: AlertItemProps) {
	const isPenalty = notificationType === 4;

	return (
		<button
			type="button"
			onClick={() => onClick(notificationId, pageUrl)}
			className={cn(
				"w-full text-left rounded-[10px] bg-white px-6 py-8 flex items-center gap-[26px]",
				"shadow-[0_0_16.8px_rgba(0,0,0,0.15)] transition-colors",
				read ? "opacity-50" : "hover:bg-gray-50",
			)}
		>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div onClick={(e) => e.stopPropagation()}>
				<Checkbox
					isChecked={isChecked}
					onCheckedChange={() => onChangeCheckedValue(notificationId)}
				/>
			</div>
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
		</button>
	);
}
