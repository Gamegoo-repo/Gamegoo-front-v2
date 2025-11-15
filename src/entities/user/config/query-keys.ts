export const userKeys = {
	all: ["user"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (filters: string) => [...userKeys.lists(), { filters }] as const,
	profiles: () => [...userKeys.all, "profile"] as const,
	profile: (id: number) => [...userKeys.profiles(), id] as const,
	profileDetail: (id: number, detail: "stats") =>
		[...userKeys.profile(id), detail] as const,
	manner: (id: number) => [...userKeys.profile(id), "manner"] as const,
	mannerDetail: (id: number, type: "level" | "keywords") =>
		[...userKeys.manner(id), type] as const,
	relationships: () => [...userKeys.all, "relationship"] as const,
	friend: () => [...userKeys.relationships(), "friend"] as const,
	blocked: () => [...userKeys.relationships(), "blocked"] as const,
	me: () => [...userKeys.all, "me"] as const,
} as const;
