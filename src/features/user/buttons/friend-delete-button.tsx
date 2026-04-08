import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { updateLolBtiBoardRelation } from "@/features/user/lib/update-lolbti-board-relation";
import { queryClient } from "@/shared/lib/query-client";
import { toast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui";

export default function FriendDeleteButton({ userId }: { userId: number }) {
	const deleteFriendMutation = useMutation({
		mutationFn: () => api.private.friend.deleteFriend(userId),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: userKeys.profile(userId),
			});
			const previous = queryClient.getQueryData(userKeys.profile(userId));

			queryClient.setQueryData(
				userKeys.profile(userId),
				(old: OtherProfileResponse) => ({
					...old,
					friend: false,
				}),
			);

			return { previous };
		},
		onError: (err, _, context) => {
			console.error(err.message);
			// 롤백
			queryClient.setQueryData(userKeys.profile(userId), context?.previous);
			toast.error("친구 목록에서 제거하는 데 실패했습니다.");
		},
		onSuccess: () => {
			toast.confirm("친구 목록에서 제거하였습니다.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: userKeys.profile(userId),
			});
			// 유저의 친구 목록 갱신
			queryClient.invalidateQueries({ queryKey: userKeys.friend() });
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
			variant={"warning"}
			size="xl"
			className="bold-14 h-[45px] mobile:w-[218px] w-full mobile:rounded-xl rounded-[6px]"
			onClick={() => deleteFriendMutation.mutate()}
		>
			친구 삭제
		</Button>
	);
}
