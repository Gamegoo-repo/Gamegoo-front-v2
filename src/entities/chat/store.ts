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

	setFriendOnline: (friendId) =>
		set((state) => {
			if (Array.isArray(friendId)) {
				// 배열인 경우 전체를 업데이트
				console.log("🔄 온라인 친구 목록 전체 업데이트:", friendId);
				console.log("📊 이전 상태:", state.onlineFriends);
				const newState = { onlineFriends: friendId };
				console.log("📊 새로운 상태:", newState.onlineFriends);
				return newState;
			} else {
				// 개별 온라인 친구 id 추가
				if (!state.onlineFriends.includes(friendId)) {
					console.log("➕ 친구 온라인 상태 추가:", friendId);
					console.log("📊 이전 상태:", state.onlineFriends);
					const newState = {
						onlineFriends: [...state.onlineFriends, friendId],
					};
					console.log("📊 새로운 상태:", newState.onlineFriends);
					return newState;
				}
				console.log("⚠️ 이미 온라인 상태인 친구:", friendId);
				return state;
			}
		}),

	setFriendOffline: (friendId) =>
		set((state) => {
			console.log("➖ 친구 오프라인 상태 변경:", friendId);
			console.log("📊 이전 상태:", state.onlineFriends);
			const newOnlineFriends = state.onlineFriends.filter(
				(id) => id !== friendId,
			);
			console.log("📊 새로운 상태:", newOnlineFriends);
			return { onlineFriends: newOnlineFriends };
		}),
}));
