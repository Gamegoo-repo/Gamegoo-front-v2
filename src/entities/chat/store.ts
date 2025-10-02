import { create } from "zustand";
import type { ChatroomResponse } from "@/shared/api";
import type { ChatMessage, ChatState } from "./types";

interface ChatActions {
	addMessage: (message: ChatMessage, chatroomUuid: string) => void;
	addSystemMessage: (message: ChatMessage, chatroomUuid: string) => void;
	addMyMessage: (message: ChatMessage, chatroomUuid: string) => void;
	markAsRead: (chatroomUuid: string) => void;
	updateChatroom: (chatroom: ChatroomResponse) => void;
	setChatrooms: (chatrooms: ChatroomResponse[]) => void;
	setConnected: (connected: boolean) => void;
	incrementUnreadCount: (chatroomUuid: string) => void;
	resetUnreadCount: (chatroomUuid: string) => void;
	getTotalUnreadCount: () => number;
	setFriendOnline: (friendId: number | number[]) => void;
	setFriendOffline: (friendId: number) => void;
	setCurrentChatroomUuid: (uuid: string | null) => void;
	getChatroomMessages: (chatroomUuid: string) => ChatMessage[];
	clearChatroomMessages: (chatroomUuid: string) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
	// State
	chatrooms: [],
	chatroomMessages: {},
	totalUnreadCount: 0,
	isConnected: false,
	onlineFriends: [],
	currentChatroomUuid: null,

	// Actions
	addMessage: (message, chatroomUuid) =>
		set((state) => {
			// 메시지를 해당 채팅방의 메시지 리스트에 추가
			const currentMessages = state.chatroomMessages[chatroomUuid] || [];
			const updatedMessages = [...currentMessages, message];

			// 채팅방 정보 업데이트 (마지막 메시지, 읽지 않은 메시지 수)
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					// 현재 보고 있는 채팅방이 아닌 경우에만 읽지 않은 메시지 수 증가
					const shouldIncrementUnread =
						state.currentChatroomUuid !== chatroomUuid;
					return {
						...room,
						lastMsg: message.message,
						lastMsgAt: message.createdAt,
						lastMsgTimestamp: message.timestamp,
						notReadMsgCnt: shouldIncrementUnread
							? (room.notReadMsgCnt || 0) + 1
							: room.notReadMsgCnt,
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
				chatroomMessages: {
					...state.chatroomMessages,
					[chatroomUuid]: updatedMessages,
				},
				totalUnreadCount: totalUnread,
			};
		}),

	addSystemMessage: (message, chatroomUuid) =>
		set((state) => {
			// 시스템 메시지는 읽지 않은 메시지 수에 포함하지 않음
			const currentMessages = state.chatroomMessages[chatroomUuid] || [];
			const updatedMessages = [...currentMessages, message];

			return {
				chatroomMessages: {
					...state.chatroomMessages,
					[chatroomUuid]: updatedMessages,
				},
			};
		}),

	addMyMessage: (message, chatroomUuid) =>
		set((state) => {
			// 내가 보낸 메시지 처리
			const currentMessages = state.chatroomMessages[chatroomUuid] || [];
			const updatedMessages = [...currentMessages, message];

			// 채팅방 정보 업데이트 (마지막 메시지만 업데이트, 읽지 않은 메시지 수는 증가하지 않음)
			const updatedChatrooms = state.chatrooms.map((room) => {
				if (room.uuid === chatroomUuid) {
					return {
						...room,
						lastMsg: message.message,
						lastMsgAt: message.createdAt,
						lastMsgTimestamp: message.timestamp,
					};
				}
				return room;
			});

			return {
				chatrooms: updatedChatrooms,
				chatroomMessages: {
					...state.chatroomMessages,
					[chatroomUuid]: updatedMessages,
				},
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

	setCurrentChatroomUuid: (uuid) => set({ currentChatroomUuid: uuid }),

	getChatroomMessages: (chatroomUuid) => {
		const state = get();
		return state.chatroomMessages[chatroomUuid] || [];
	},

	clearChatroomMessages: (chatroomUuid) =>
		set((state) => {
			const newChatroomMessages = { ...state.chatroomMessages };
			delete newChatroomMessages[chatroomUuid];
			return { chatroomMessages: newChatroomMessages };
		}),
}));
