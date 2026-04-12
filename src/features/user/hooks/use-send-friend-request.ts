import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { updateLolBtiBoardRelation } from "@/features/user/lib/update-lolbti-board-relation";
import { toast } from "@/shared/lib/toast";
import { useAuth } from "@/shared/model/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendFriendRequest(userId: number) {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	return useMutation({
		mutationFn: () => api.private.friend.sendFriendRequest(userId),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: userKeys.profile(userId) });
			const previous = queryClient.getQueryData(userKeys.profile(userId));

			queryClient.setQueryData(
				userKeys.profile(userId),
				(old: OtherProfileResponse | undefined) => {
					if (!old || !user) return old;
					return { ...old, friendRequestMemberId: user.id };
				},
			);

			return { previous };
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(userKeys.profile(userId), context?.previous);
			toast.error("친구 요청이 실패했습니다.");
		},
		onSuccess: () => {
			toast.confirm("친구 요청을 보냈습니다.");
			updateLolBtiBoardRelation(queryClient, userId, {
				friend: false,
				friendRequestReceived: false,
				friendRequestSent: true,
				nonFriend: false,
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: userKeys.profile(userId),
			});
		},
	});
}
