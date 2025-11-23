import type { MyProfileResponse } from "@/shared/api";

export const getAuthUserId = (
	authUser: Partial<MyProfileResponse> | null | undefined,
): number | null => {
	const id = authUser?.id;
	return typeof id === "number" && Number.isFinite(id) ? id : null;
};

export const makeMatchingRequestKeyFromId = (id: number): string => {
	return `matching-request-sent:${id}`;
};
