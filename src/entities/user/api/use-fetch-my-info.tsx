import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type MyProfileResponse } from "@/shared/api";

export const useFetchMyInfo = () => {
	return useQuery({
		queryKey: userKeys.me(),
		queryFn: async () => {
			const response = await api.private.member.getMemberJWT();
			return response.data?.data || null;
		},
		select: (data) => data as MyProfileResponse | null,
	});
};
