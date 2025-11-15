import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";

/** TODO: 두 개가 존재하는 것 같아서 사용하지 않는거 제거하기 */
export const useFetchMyBlockedUsers = (page: number, enabled = true) => {
	return useQuery({
		queryKey: userKeys.blocked(),
		queryFn: async () => {
			const response = await api.private.block.getBlockList(page);
			return response.data?.data || null;
		},
		enabled: enabled,
	});
};
