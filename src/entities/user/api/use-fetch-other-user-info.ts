import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { userKeys } from "@/entities/user/config/query-keys";
import {
	api,
	type MannerKeywordListResponse,
	type MannerResponse,
	type OtherProfileResponse,
} from "@/shared/api";

const refreshingUserIds = new Set<number>();

export const useFetchOtherUserProfile = (
	userId: number,
	options?: UseFetchOtherUserOptions,
) => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: userKeys.profile(userId),
		queryFn: async () => {
			const response = await api.private.member.getMember(userId);
			return response.data?.data as OtherProfileResponse | undefined;
		},
		...options,
	});

	useEffect(() => {
		if (query.data?.canRefresh && !refreshingUserIds.has(userId)) {
			refreshingUserIds.add(userId);

			api.private.member
				.refreshChampionStats(userId)
				.then((refreshResponse) => {
					const refreshedData = refreshResponse.data?.data;
					if (refreshedData && query.data) {
						queryClient.setQueryData(userKeys.profile(userId), {
							...query.data,
							championStatsResponseList: refreshedData.championStatsResponseList,
							memberRecentStats: refreshedData.memberRecentStats,
							canRefresh: false,
						});
					}
				})
				.catch((error) => {
					console.error("Failed to refresh champion stats:", error);
				})
				.finally(() => {
					refreshingUserIds.delete(userId);
				});
		}
	}, [query.data, userId, queryClient]);

	return query;
};

export const useFetchOtherUserMannerKeywords = (
	userId: number,
	options?: UseFetchOtherUserOptions,
) => {
	return useQuery({
		queryKey: userKeys.mannerDetail(userId, "keywords"),
		queryFn: async () => {
			const response = await api.private.manner.getMannerKeywordInfo(userId);
			return response.data?.data as MannerKeywordListResponse | undefined;
		},
		...options,
	});
};

export const useFetchOtherUserMannerLevel = (
	userId: number,
	options?: UseFetchOtherUserOptions,
) => {
	return useQuery({
		queryKey: userKeys.mannerDetail(userId, "level"),
		queryFn: async () => {
			const response = await api.private.manner.getMannerLevelInfo(userId);
			return response.data?.data as MannerResponse | undefined;
		},
		...options,
	});
};

type UseFetchOtherUserOptions = {
	enabled?: boolean;
};

export const useFetchOtherUserInfo = (
	userId: number,
	options?: UseFetchOtherUserOptions,
) => {
	const profile = useFetchOtherUserProfile(userId, options);
	const mannerKeywords = useFetchOtherUserMannerKeywords(userId, options);
	const mannerLevel = useFetchOtherUserMannerLevel(userId, options);

	const isPending =
		profile.isPending || mannerKeywords.isPending || mannerLevel.isPending;
	const isError =
		profile.isError || mannerKeywords.isError || mannerLevel.isError;
	const error = profile.error || mannerKeywords.error || mannerLevel.error;

	return {
		data: {
			profile: profile.data,
			mannerKeywords: mannerKeywords.data,
			mannerLevel: mannerLevel.data,
		},
		isPending,
		isError,
		error,
		isSuccess:
			profile.isSuccess && mannerKeywords.isSuccess && mannerLevel.isSuccess,
	};
};
