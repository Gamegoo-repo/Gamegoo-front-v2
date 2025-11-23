import Noti1Icon from "@/widgets/notification/assets/noti_1.svg?react";
import Noti2Icon from "@/widgets/notification/assets/noti_2.svg?react";
import Noti3Icon from "@/widgets/notification/assets/noti_3.svg?react";
import Noti4Icon from "@/widgets/notification/assets/noti_4.svg?react";

interface NotificationIconProps {
	type: number;
	className?: string;
}

export default function NotificationIcon({
	type,
	className,
}: NotificationIconProps) {
	switch (type) {
		case 1:
			return <Noti1Icon className={className} />;
		case 2:
			return <Noti2Icon className={className} />;
		case 3:
			return <Noti3Icon className={className} />;
		case 4:
			return <Noti4Icon className={className} />;
		default:
			return <Noti1Icon className={className} />;
	}
}
