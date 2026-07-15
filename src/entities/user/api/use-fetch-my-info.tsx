import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type MyProfileResponse } from "@/shared/api";

let isRefreshing = false;

export const useFetchMyInfo = () => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: userKeys.me(),
		queryFn: async () => {
			const response = await api.private.member.getMemberJWT();
			return response.data?.data as MyProfileResponse | null;
		},
	});

	useEffect(() => {
		if (query.data?.canRefresh && !isRefreshing) {
			isRefreshing = true;

			api.private.member
				.refreshChampionStats()
				.then((refreshResponse) => {
					const refreshedData = refreshResponse.data?.data;
					if (refreshedData) {
						queryClient.setQueryData(userKeys.me(), {
							...refreshedData,
							canRefresh: false,
						});
					}
				})
				.catch((error) => {
					console.error("Failed to refresh champion stats:", error);
				})
				.finally(() => {
					isRefreshing = false;
				});
		}
	}, [query.data?.canRefresh, queryClient]);

	return query;
};
