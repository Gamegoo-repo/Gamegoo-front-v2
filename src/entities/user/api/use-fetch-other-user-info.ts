import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useFetchOtherUserProfileInfo = (userId: number) => {
	const query = useQuery({
		queryKey: ["users", "profile", userId],
		queryFn: () => api.private.member.getMember(userId),
	});

	return {
		...query,
		data: query.data?.data.data,
	};
};

export const useFetchOtherUserMannerKeywordsInfo = (userId: number) => {
	const query = useQuery({
		queryKey: ["users", "manner", "keywords", userId],
		queryFn: () => api.private.manner.getMannerKeywordInfo(userId),
	});

	return {
		...query,
		data: query.data?.data.data,
	};
};

export const useFetchOtherUserMannerLevelInfo = (userId: number) => {
	const query = useQuery({
		queryKey: ["users", "manner", "level", userId],
		queryFn: () => api.private.manner.getMannerLevelInfo(userId),
	});

	return {
		...query,
		data: query.data?.data.data,
	};
};
