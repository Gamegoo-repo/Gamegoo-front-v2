import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type MyProfileResponse } from "@/shared/api";

export const useFetchMyInfo = () => {
	const queryClient = useQueryClient();
	const isRefreshingRef = useRef(false);

	const query = useQuery({
		queryKey: userKeys.me(),
		queryFn: async () => {
			const response = await api.private.member.getMemberJWT();
			return response.data?.data as MyProfileResponse | null;
		},
	});

	useEffect(() => {
		if (query.data?.canRefresh && !isRefreshingRef.current) {
			isRefreshingRef.current = true;

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
					isRefreshingRef.current = false;
				});
		}
	}, [query.data?.canRefresh, queryClient]);

	return query;
};
