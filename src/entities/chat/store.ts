import { create } from "zustand";
import type { ChatroomResponse } from "@/shared/api";
import type { ChatMessage, ChatState } from "./types";

interface ChatActions {
	addMessage: (message: ChatMessage, chatroomUuid: string) => void;
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

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
	// State
	chatrooms: [],
	totalUnreadCount: 0,
	isConnected: false,
	onlineFriends: [],

	// Actions
	addMessage: (message, chatroomUuid) =>
		set((state) => {
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					return {
						...room,
						lastMsg: message.message,
						lastMsgAt: message.createdAt,
						lastMsgTimestamp: message.timestamp,
						notReadMsgCnt: (room.notReadMsgCnt || 0) + 1,
					};
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
		set(() => {
			const totalUnread = chatrooms.reduce(
				(sum, room) => sum + (room.notReadMsgCnt || 0),
				0,
			);

			return {
				chatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	setConnected: (connected) => set({ isConnected: connected }),

	incrementUnreadCount: (chatroomUuid) =>
		set((state) => {
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					return { ...room, notReadMsgCnt: (room.notReadMsgCnt || 0) + 1 };
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

	getTotalUnreadCount: () => get().totalUnreadCount,

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
