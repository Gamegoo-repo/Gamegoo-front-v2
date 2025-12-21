import { useMemo } from "react";
import { useChatDialogStore, useChatStore } from "@/entities/chat";
import {
	BadMannerEvaluateMenuItem,
	BlockMenuItem,
	ChatroomLeaveMenuItem,
	FriendAddMenuItem,
	FriendDeleteMenuItem,
	FriendRequestAcceptMenuItem,
	FriendRequestCancelMenuItem,
	FriendRequestDeclineMenuItem,
	MannerEvaluateMenuItem,
	PopoverMenu,
	ReportMenuItem,
	UnblockMenuItem,
} from "@/features/popover-menu";
import { ProfileAvatar } from "@/features/profile";
import type { ApiResponseEnterChatroomResponse } from "@/shared/api";
import LeftArrowIcon from "@/shared/assets/icons/left_arrow.svg?react";
import { copyRiotIdToClipboard } from "@/shared/lib/copy-riot-id";
import { toast } from "@/shared/lib/toast";
import { useAuth } from "@/shared/model/use-auth";

interface ChatroomHeaderProps {
	enterData?: ApiResponseEnterChatroomResponse;
}

const ChatroomHeader = ({ enterData }: ChatroomHeaderProps) => {
	const { chatroom, setChatDialogType } = useChatDialogStore();
	const { onlineFriends } = useChatStore();

	const isOnline = chatroom?.targetMemberId
		? onlineFriends.includes(chatroom.targetMemberId)
		: false;

	const isFriend = enterData?.data?.friend;
	const { user } = useAuth();
	const isMyFriendRequest =
		!!enterData?.data?.friendRequestMemberId &&
		enterData?.data?.friendRequestMemberId === (user?.id || 0);
	const isReceivedFriendRequest =
		!!enterData?.data?.friendRequestMemberId &&
		enterData?.data?.friendRequestMemberId === (chatroom?.targetMemberId || 0);

	const handleCopyRiotId = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const gameName = chatroom?.targetMemberName || "";
		const tag = chatroom?.tag || "";
		if (!gameName || !tag) {
			toast.error("복사 실패");
			return;
		}
		const { ok } = await copyRiotIdToClipboard({ gameName, tag });
		if (ok) toast.confirm("소환사명이 복사되었습니다.");
		else toast.error("복사 실패");
	};

	const MENU_ITEMS = useMemo(() => {
		const items: React.ReactElement[] = [
			<ChatroomLeaveMenuItem
				key="leave"
				chatroomId={chatroom?.uuid || ""}
				onSuccess={() => setChatDialogType("chatroom-list")}
			/>,
		];

		if (!isFriend && !enterData?.data?.friendRequestMemberId) {
			items.push(
				<FriendAddMenuItem
					key="friend-add"
					userId={chatroom?.targetMemberId || 0}
				/>,
			);
		}

		if (!isFriend && isReceivedFriendRequest) {
			items.push(
				<FriendRequestAcceptMenuItem
					key="friend-request-accept"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
			items.push(
				<FriendRequestDeclineMenuItem
					key="friend-request-decline"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
		}

		if (!isFriend && isMyFriendRequest) {
			items.push(
				<FriendRequestCancelMenuItem
					key="friend-request-cancel"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
		}

		if (isFriend) {
			items.push(
				<FriendDeleteMenuItem
					key="friend-delete"
					userId={chatroom?.targetMemberId || 0}
				/>,
			);
		}

		items.push(
			<ReportMenuItem
				key="report"
				userId={chatroom?.targetMemberId || 0}
				reportType="CHAT"
			/>,
		);

		// 차단하기: 이미 차단했거나 상대가 나를 차단한 경우는 노출하지 않음
		if (!enterData?.data?.blocked && !enterData?.data?.blockedByTarget) {
			items.push(
				<BlockMenuItem
					key="block"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
		}

		// 차단 해제: 내가 차단한 경우 노출
		if (enterData?.data?.blocked) {
			items.push(
				<UnblockMenuItem
					key="unblock"
					userId={chatroom?.targetMemberId || 0}
					chatroomUuid={chatroom?.uuid || ""}
				/>,
			);
		}

		items.push(<MannerEvaluateMenuItem key="manner-evaluate" />);
		items.push(<BadMannerEvaluateMenuItem key="bad-manner-evaluate" />);

		return items;
	}, [
		isFriend,
		enterData?.data?.friendRequestMemberId,
		chatroom?.uuid,
		chatroom?.targetMemberId,
		enterData?.data?.blocked,
	]);

	return (
		<div className="flex h-[var(--chatroom-header-height)] px-[12px] pt-[12px]">
			<div className="flex w-full items-center gap-2 border-violet-300 border-b py-2 pl-2">
				<LeftArrowIcon
					className="cursor-pointer"
					onClick={() => setChatDialogType("chatroom-list")}
				/>
				<ProfileAvatar size="md" profileIndex={chatroom?.targetMemberImg} />
				<div className="flex-1">
					<div className="flex items-center gap-2">
						<div className="relative flex flex-col gap-[2px]">
							<div className="flex items-center gap-[2px]">
								<p className="font-medium text-gray-900">
									{chatroom?.targetMemberName}
								</p>
								<p className="regular-13 text-gray-600">#{chatroom?.tag}</p>
							</div>
							<button
								type="button"
								onClick={handleCopyRiotId}
								className="flex cursor-pointer items-center justify-center rounded-sm border border-gray-300 bg-gray-100 px-[2px] font-medium text-[11px] text-gray-600"
							>
								소환사명 복사
							</button>

							{isFriend && (
								<>
									{isOnline && (
										<div className="-top-1 -right-2 absolute h-[7px] w-[7px] rounded-full bg-green-500" />
									)}
									<p className="regular-11 ml-[2px] text-gray-600">
										{isOnline ? "온라인" : "오프라인"}
									</p>
								</>
							)}
						</div>
					</div>
				</div>
				{<PopoverMenu menuItems={MENU_ITEMS} />}
			</div>
		</div>
	);
};

export default ChatroomHeader;
