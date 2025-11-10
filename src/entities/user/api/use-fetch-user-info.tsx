import { useQuery } from "@tanstack/react-query";
import { type MyProfileResponse, api } from "@/shared/api";

export const useFetchUserInfo = () => {
	return useQuery({
		queryKey: ["my-profile"],
		queryFn: async () => {
			const response = await api.private.member.getMemberJWT();
			return response.data?.data || null;
		},
		select: (data) => data as MyProfileResponse | null,
	});
};
