import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
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
			// toast.error("요청 취소 실패");
			alert("친구 요청 거절 실패");
		},
		onSuccess: () => {
			// toast.success("친구 요청을 취소했습니다");
			alert("친구 요청을 거절했습니다.");
		},
		onSettled: () => {
			// 프로필 쿼리 갱신
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
		},
	});

	return (
		<Button
			variant={"black"}
			size="xl"
			className="w-[150px] h-[45px] bold-14 rounded-xl"
			onClick={() => declineRequestMutation.mutate()}
		>
			친구 거절
		</Button>
	);
}
