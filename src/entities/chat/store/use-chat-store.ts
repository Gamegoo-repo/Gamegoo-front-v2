import { create } from "zustand";
import type { ChatroomResponse } from "@/shared/api";
import type { ChatState } from "../types";

interface ChatActions {
	markAsRead: (chatroomUuid: string) => void;
	updateChatroom: (chatroom: ChatroomResponse) => void;
	setChatrooms: (chatrooms: ChatroomResponse[]) => void;
	setConnected: (connected: boolean) => void;
	incrementUnreadCount: (chatroomUuid: string) => void;
	resetUnreadCount: (chatroomUuid: string) => void;
	getTotalUnreadCount: () => number;
	setFriendOnline: (friendId: number | number[]) => void;
	setFriendOffline: (friendId: number) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, _get) => ({
	// State
	chatrooms: [],
	totalUnreadCount: 0,
	isConnected: false,
	onlineFriends: [],

	// Actions

	markAsRead: (chatroomUuid) =>
		set((state) => {
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					return { ...room, notReadMsgCnt: 0 };
				}
				return room;
			});

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + (room.notReadMsgCnt || 0),
				0,
			);

			return {
				chatrooms: updatedChatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	updateChatroom: (chatroom) =>
		set((state) => {
			const existingIndex = state.chatrooms.findIndex(
				(room) => room.uuid === chatroom.uuid,
			);

			let updatedChatrooms: ChatroomResponse[];
			if (existingIndex >= 0) {
				updatedChatrooms = [...state.chatrooms];
				updatedChatrooms[existingIndex] = chatroom;
			} else {
				updatedChatrooms = [...state.chatrooms, chatroom];
			}

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + (room.notReadMsgCnt || 0),
				0,
			);

			return {
				chatrooms: updatedChatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	setChatrooms: (chatrooms) =>
		set((state) => {
			const updatedChatrooms = chatrooms.map((newRoom) => {
				const existingRoom = state.chatrooms.find(
					(r) => r.uuid === newRoom.uuid,
				);

				if (existingRoom && existingRoom.notReadMsgCnt === 0) {
					return { ...newRoom, notReadMsgCnt: 0 };
				}

				return newRoom;
			});

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + (room.notReadMsgCnt || 0),
				0,
			);

			return {
				chatrooms: updatedChatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	setConnected: (connected) => set({ isConnected: connected }),

	incrementUnreadCount: (chatroomUuid) =>
		set((state) => {
			const existingRoomIndex = state.chatrooms.findIndex(
				(room) => room.uuid === chatroomUuid,
			);

			let updatedChatrooms: ChatroomResponse[];
			if (existingRoomIndex >= 0) {
				updatedChatrooms = state.chatrooms.map((room) => {
					if (room.uuid === chatroomUuid) {
						return { ...room, notReadMsgCnt: (room.notReadMsgCnt || 0) + 1 };
					}
					return room;
				});
			} else {
				const newRoom: ChatroomResponse = {
					uuid: chatroomUuid,
					notReadMsgCnt: 1,
					targetMemberName: "새 메시지",
					targetMemberImg: 0,
					lastMsg: "새 메시지가 도착했습니다",
					lastMsgAt: new Date().toISOString(),
					targetMemberId: 0,
				};
				updatedChatrooms = [...state.chatrooms, newRoom];
			}

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + (room.notReadMsgCnt || 0),
				0,
			);

			return {
				chatrooms: updatedChatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	resetUnreadCount: (chatroomUuid) =>
		set((state) => {
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					return { ...room, notReadMsgCnt: 0 };
				}
				return room;
			});

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + (room.notReadMsgCnt || 0),
				0,
			);

			return {
				chatrooms: updatedChatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	getTotalUnreadCount: () => _get().totalUnreadCount,

	setFriendOnline: (friendId) =>
		set((state) => {
			if (Array.isArray(friendId)) {
				return { onlineFriends: friendId };
			} else {
				if (!state.onlineFriends.includes(friendId)) {
					const newState = {
						onlineFriends: [...state.onlineFriends, friendId],
					};
					return newState;
				}
				return state;
			}
		}),

	setFriendOffline: (friendId) =>
		set((state) => {
			const newOnlineFriends = state.onlineFriends.filter(
				(id) => id !== friendId,
			);
			return { onlineFriends: newOnlineFriends };
		}),
}));
