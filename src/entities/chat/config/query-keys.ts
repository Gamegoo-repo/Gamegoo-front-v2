export const chatKeys = {
	all: ["chat"] as const,
	rooms: () => [...chatKeys.all, "rooms"] as const,
	room: (uuid: string) => [...chatKeys.rooms(), uuid] as const,
	enter: (uuid: string) => [...chatKeys.room(uuid), "enter"] as const,
	messages: (uuid: string) => [...chatKeys.room(uuid), "messages"] as const,
	unreadRooms: () => [...chatKeys.rooms(), "unread"] as const,
} as const;
