import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import UserProfile from "@/entities/user/ui/user-profile";
import BlockedIcon from "@/shared/assets/icons/blocked.svg?react";
import ChevronDownIcon from "@/shared/assets/icons/chevron_down.svg?react";
import CustomerServiceIcon from "@/shared/assets/icons/customer_service.svg?react";
import LogoutIcon from "@/shared/assets/icons/logout.svg?react";
import MyPostIcon from "@/shared/assets/icons/my_post.svg?react";
import MyReviewIcon from "@/shared/assets/icons/my_review.svg?react";
import NotiOnIcon from "@/shared/assets/icons/noti_on.svg?react";
import SettingIcon from "@/shared/assets/icons/setting.svg?react";
import { cn } from "@/shared/lib/utils";
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
				"flex w-full items-center gap-4 pl-[9px] py-4 rounded-[12px] hover:bg-gray-200 text-gray-800 medium-16 cursor-pointer",
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
				"flex w-full items-center gap-4 pl-[9px] py-4 rounded-[12px] hover:bg-gray-200 text-gray-800 medium-16 cursor-pointer",
				className,
			)}
		>
			<Icon className="shrink-0 text-gray-700" />
			<span>{label}</span>
		</button>
	);
}

export default function HeaderUserMenu() {
	const [open, setOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex items-center gap-[20px]">
			<Link
				to="/mypage/notification"
				aria-label="알림"
				className="cursor-pointer"
			>
				<NotiOnIcon />
			</Link>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex items-center gap-[10px] cursor-pointer"
			>
				<UserProfile id={1} hasDropShadow />
				<ChevronDownIcon />
			</button>
			<Modal
				isOpen={open}
				onClose={() => setOpen(false)}
				ref={modalRef}
				className="w-[420px] p-8 bg-white"
				hideCloseButton
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<UserProfile id={1} size={64} hasDropShadow />
						<div className="bold-20 text-gray-900">커피한잔</div>
					</div>
					<Link
						to="/mypage/notification"
						aria-label="알림"
						onClick={() => {
							setOpen(false);
						}}
						className="cursor-pointer"
					>
						<NotiOnIcon />
					</Link>
				</div>

				<div className="h-px bg-gray-300 my-6" />

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

				<div className="h-px bg-gray-300 my-6" />

				<div className="flex flex-col gap-2">
					<MenuItem
						icon={CustomerServiceIcon}
						label="고객센터"
						to="/mypage/service"
						onClick={() => setOpen(false)}
					/>
					<MenuItem icon={LogoutIcon} label="로그아웃" />
				</div>
			</Modal>
		</div>
	);
}
