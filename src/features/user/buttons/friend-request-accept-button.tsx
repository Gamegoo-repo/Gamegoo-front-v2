import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "@/shared/lib/toast";
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
			toast.error("친구 요청 수락에 실패하였습니다.");
		},
		onSuccess: () => {
			toast.confirm("친구 요청을 수락했습니다.");
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
			className="bold-14 h-[45px] mobile:w-[150px] w-1/2 mobile:rounded-xl rounded-[6px]"
			disabled={acceptRequestMutation.isPending}
			onClick={() => acceptRequestMutation.mutate()}
		>
			친구 수락
		</Button>
	);
}
