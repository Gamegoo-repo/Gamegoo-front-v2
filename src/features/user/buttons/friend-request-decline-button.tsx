import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { updateLolBtiBoardRelation } from "@/features/user/lib/update-lolbti-board-relation";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui";

export default function FriendRequestDeclineButton({
	userId,
}: {
	userId: number;
}) {
	const declineRequestMutation = useMutation({
		mutationFn: () => api.private.friend.rejectFriendRequest(userId),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: userKeys.profile(userId),
			});
			const previous = queryClient.getQueryData(userKeys.profile(userId));

			queryClient.setQueryData(
				userKeys.profile(userId),
				(old: OtherProfileResponse) => ({
					...old,
					friendRequestMemberId: undefined,
				}),
			);

			return { previous };
		},
		onError: (err, _, context) => {
			console.log(err);
			queryClient.setQueryData(userKeys.profile(userId), context?.previous);
			toast.error("친구 요청 거절에 실패했습니다.");
		},
		onSuccess: () => {
			toast.confirm("친구 요청을 거절했습니다.");
		},
		onSettled: () => {
			// 프로필 쿼리 갱신
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
			// 롤BTI 추천 목록 refetch 없이 해당 유저의 관계 필드만 업데이트
			updateLolBtiBoardRelation(queryClient, userId, {
				friend: false,
				friendRequestReceived: false,
				friendRequestSent: false,
				nonFriend: true,
			});
		},
	});

	return (
		<Button
			variant={"black"}
			size="xl"
			className="bold-14 h-[45px] mobile:w-[150px] w-1/2 mobile:rounded-xl rounded-[6px]"
			onClick={() => declineRequestMutation.mutate()}
		>
			친구 거절
		</Button>
	);
}
