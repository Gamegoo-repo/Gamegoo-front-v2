import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api";

export const useFetchMannerKeywords = (memberId: number) => {
	return useQuery({
		queryKey: ["manner", memberId],
		queryFn: async () => {
			const response = await api.private.manner.getMannerKeywordInfo(memberId);
			return response.data?.data || null;
		},
	});
};
