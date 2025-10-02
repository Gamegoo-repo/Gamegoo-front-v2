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
			const currentMessages = state.chatroomMessages[chatroomUuid] || [];
			
			const isDuplicate = currentMessages.some(
				existingMsg => existingMsg.timestamp === message.timestamp && 
				existingMsg.senderId === message.senderId &&
				existingMsg.message === message.message
			);
			
			if (isDuplicate) {
				return state;
			}
			
			const updatedMessages = [...currentMessages, message];

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
				chatroomMessages: {
					...state.chatroomMessages,
					[chatroomUuid]: updatedMessages,
				},
				totalUnreadCount: totalUnread,
			};
		}),

	addSystemMessage: (message, chatroomUuid) =>
		set((state) => {
			const currentMessages = state.chatroomMessages[chatroomUuid] || [];
			
			const isDuplicate = currentMessages.some(
				existingMsg => existingMsg.timestamp === message.timestamp && 
				existingMsg.senderId === message.senderId &&
				existingMsg.message === message.message
			);
			
			if (isDuplicate) {
				return state;
			}
			
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
			const currentMessages = state.chatroomMessages[chatroomUuid] || [];
			
			const isDuplicate = currentMessages.some(
				existingMsg => existingMsg.timestamp === message.timestamp && 
				existingMsg.senderId === message.senderId &&
				existingMsg.message === message.message
			);
			
			if (isDuplicate) {
				return state;
			}
			
			const updatedMessages = [...currentMessages, message];

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
		set((state) => {
			const updatedChatrooms = chatrooms.map((newRoom) => {
				const existingRoom = state.chatrooms.find(r => r.uuid === newRoom.uuid);
				
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
