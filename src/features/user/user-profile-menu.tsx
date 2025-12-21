import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import UserProfile from "@/entities/user/ui/user-profile";
import { notificationKeys } from "@/features/notification/api/query-keys";
import { api } from "@/shared/api";
import { useSocketMessage } from "@/shared/api/socket";
import BlockedIcon from "@/shared/assets/icons/blocked.svg?react";
import ChevronDownIcon from "@/shared/assets/icons/chevron_down.svg?react";
import CustomerServiceIcon from "@/shared/assets/icons/customer_service.svg?react";
import LogoutIcon from "@/shared/assets/icons/logout.svg?react";
import MyPostIcon from "@/shared/assets/icons/my_post.svg?react";
import MyReviewIcon from "@/shared/assets/icons/my_review.svg?react";
import NotiOffIcon from "@/shared/assets/icons/noti_off.svg?react";
import NotiOnIcon from "@/shared/assets/icons/noti_on.svg?react";
import SettingIcon from "@/shared/assets/icons/setting.svg?react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/model/use-auth";
import Modal from "@/shared/ui/modal/modal";

function MenuItem({
	icon: Icon,
	label,
	onClick,
	to,
	className,
}: {
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	label: string;
	onClick?: () => void;
	to?: string;
	className?: string;
}) {
	return to ? (
		<Link
			to={to}
			onClick={onClick}
			className={cn(
				"medium-16 flex w-full cursor-pointer items-center gap-4 rounded-[12px] py-4 pl-[9px] text-gray-800 hover:bg-gray-200",
				className,
			)}
		>
			<Icon className="shrink-0 text-gray-700" />
			<span>{label}</span>
		</Link>
	) : (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"medium-16 flex w-full cursor-pointer items-center gap-4 rounded-[12px] py-4 pl-[9px] text-gray-800 hover:bg-gray-200",
				className,
			)}
		>
			<Icon className="shrink-0 text-gray-700" />
			<span>{label}</span>
		</button>
	);
}

export default function UserProfileMenu({
	profileImage,
	name,
}: {
	profileImage: number;
	name: string;
}) {
	const [open, setOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const { logout } = useAuth();
	const queryClient = useQueryClient();

	const { data: unreadCount } = useQuery({
		queryKey: notificationKeys.unreadCount(),
		queryFn: async () => {
			const { data } =
				await api.private.notification.getUnreadNotificationCount();
			return data.data ?? 0;
		},
	});
	const hasUnread = (unreadCount ?? 0) > 0;

	useSocketMessage("new-notification", async () => {
		await queryClient.invalidateQueries({
			queryKey: notificationKeys.all,
		});
	});

	const handleLogout = () => {
		logout();
		setOpen(false);
	};

	return (
		<div className="flex items-center gap-[20px]">
			<Link
				to="/mypage/notification"
				aria-label="알림"
				className="cursor-pointer"
			>
				{hasUnread ? <NotiOnIcon /> : <NotiOffIcon />}
			</Link>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex cursor-pointer items-center gap-[10px]"
			>
				<UserProfile
					id={profileImage}
					hasDropShadow={false}
					sizeClass="w-9 h-9 mobile:w-10 mobile:h-10"
				/>
				<span className="mobile:inline hidden">{name}</span>
				<ChevronDownIcon className="mobile:block hidden" />
			</button>
			<Modal
				isOpen={open}
				onClose={() => setOpen(false)}
				ref={modalRef}
				className="w-[420px] bg-white p-8"
				hasCloseButton={false}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<UserProfile
							id={profileImage}
							sizeClass="w-16 h-16"
							hasDropShadow={false}
						/>
						<div className="bold-20 text-gray-900">{name}</div>
					</div>
					<Link
						to="/mypage/notification"
						aria-label="알림"
						onClick={() => {
							setOpen(false);
						}}
						className="cursor-pointer"
					>
						{hasUnread ? <NotiOnIcon /> : <NotiOffIcon />}
					</Link>
				</div>

				<div className="my-6 h-px bg-gray-300" />

				<div className="flex flex-col gap-2">
					<MenuItem
						icon={SettingIcon}
						label="내 정보"
						to="/mypage/profile"
						onClick={() => setOpen(false)}
					/>
					<MenuItem
						icon={MyPostIcon}
						label="내가 작성한 글"
						to="/mypage/post"
						onClick={() => setOpen(false)}
					/>
					<MenuItem
						icon={MyReviewIcon}
						label="내 평가"
						to="/mypage/review"
						onClick={() => setOpen(false)}
					/>
					<MenuItem
						icon={BlockedIcon}
						label="차단목록"
						to="/mypage/blocked"
						onClick={() => setOpen(false)}
					/>
				</div>

				<div className="my-6 h-px bg-gray-300" />

				<div className="flex flex-col gap-2">
					<MenuItem
						icon={CustomerServiceIcon}
						label="고객센터"
						to="/mypage/service"
						onClick={() => setOpen(false)}
					/>
					<MenuItem icon={LogoutIcon} label="로그아웃" onClick={handleLogout} />
				</div>
			</Modal>
		</div>
	);
}
