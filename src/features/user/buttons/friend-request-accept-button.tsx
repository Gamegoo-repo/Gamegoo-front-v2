import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
import { Button } from "@/shared/ui";

export default function FriendRequestAcceptButton({
	userId,
}: {
	userId: number;
}) {
	const acceptRequestMutation = useMutation({
		mutationFn: () => api.private.friend.acceptFriendRequest(userId),
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
					friend: true,
				}),
			);

			return { previous };
		},
		onError: (err, _, context) => {
			console.log(err);
			queryClient.setQueryData(userKeys.profile(userId), context?.previous);
			// toast.error("요청 취소 실패");
			alert("친구 요청 수락 실패");
		},
		onSuccess: () => {
			// toast.success("친구 요청을 취소했습니다");
			alert("친구 요청을 수락했습니다.");
		},
		onSettled: () => {
			// 프로필 쿼리 갱신
			queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });

			// 유저의 친구 목록 갱신
			queryClient.invalidateQueries({ queryKey: userKeys.friend() });
		},
	});

	return (
		<Button
			variant={"default"}
			size="xl"
			className="bold-14 h-[45px] w-[150px] rounded-xl"
			disabled={acceptRequestMutation.isPending}
			onClick={() => acceptRequestMutation.mutate()}
		>
			친구 수락
		</Button>
	);
}
