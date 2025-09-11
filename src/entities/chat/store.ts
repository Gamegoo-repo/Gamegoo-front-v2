import { create } from "zustand";
import type { ChatMessage, Chatroom, ChatState } from "./types";

interface ChatActions {
	addMessage: (message: ChatMessage, chatroomUuid: string) => void;
	markAsRead: (chatroomUuid: string) => void;
	updateChatroom: (chatroom: Chatroom) => void;
	setConnected: (connected: boolean) => void;
	incrementUnreadCount: (chatroomUuid: string) => void;
	resetUnreadCount: (chatroomUuid: string) => void;
	getTotalUnreadCount: () => number;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
	// State
	chatrooms: [],
	totalUnreadCount: 0,
	isConnected: false,

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
						notReadMsgCnt: room.notReadMsgCnt + 1,
					};
				}
				return room;
			});

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + room.notReadMsgCnt,
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
				(sum, room) => sum + room.notReadMsgCnt,
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

			let updatedChatrooms: Chatroom[];
			if (existingIndex >= 0) {
				updatedChatrooms = [...state.chatrooms];
				updatedChatrooms[existingIndex] = chatroom;
			} else {
				updatedChatrooms = [...state.chatrooms, chatroom];
			}

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + room.notReadMsgCnt,
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
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					return { ...room, notReadMsgCnt: room.notReadMsgCnt + 1 };
				}
				return room;
			});

			const totalUnread = updatedChatrooms.reduce(
				(sum, room) => sum + room.notReadMsgCnt,
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
				(sum, room) => sum + room.notReadMsgCnt,
				0,
			);

			return {
				chatrooms: updatedChatrooms,
				totalUnreadCount: totalUnread,
			};
		}),

	getTotalUnreadCount: () => get().totalUnreadCount,
}));
