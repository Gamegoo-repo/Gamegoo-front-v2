import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
import { Button } from "@/shared/ui";

export default function FriendRequestCancelButton({
	userId,
}: {
	userId: number;
}) {
	const cancelRequestMutation = useMutation({
		mutationFn: () => api.private.friend.cancelFriendRequest(userId),
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
			alert("요청 취소 실패");
		},
		onSuccess: () => {
			// toast.success("친구 요청을 취소했습니다");
			alert("친구 요청을 취소했습니다.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
		},
	});
	return (
		<Button
			variant={"black"}
			size="xl"
			className="w-[218px] h-[45px] bold-14 rounded-xl"
			onClick={() => cancelRequestMutation.mutate()}
		>
			친구 요청 취소
		</Button>
	);
}
