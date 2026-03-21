import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "@/shared/lib/toast";
import { useAuth } from "@/shared/model/use-auth";

export function useSendFriendRequest(userId: number) {
	const { user } = useAuth();

	return useMutation({
		mutationFn: () => api.private.friend.sendFriendRequest(userId),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: userKeys.profile(userId),
			});
			const previous = queryClient.getQueryData(userKeys.profile(userId));

			queryClient.setQueryData(
				userKeys.profile(userId),
				(old: OtherProfileResponse) => ({
					...old,
					friendRequestMemberId: user?.id,
				}),
			);

			return { previous };
		},
		onError: (err, _, context) => {
			console.log(err);
			queryClient.setQueryData(userKeys.profile(userId), context?.previous);
			toast.error("친구 요청이 실패했습니다.");
		},
		onSuccess: () => {
			toast.confirm("친구 요청을 보냈습니다.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
		},
	});
}
