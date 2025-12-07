import { useMutation } from "@tanstack/react-query";
import { userKeys } from "@/entities/user/config/query-keys";
import { api, type OtherProfileResponse } from "@/shared/api";
import { queryClient } from "@/shared/lib/query-client";
import { useAuth } from "@/shared/model/use-auth";
import { Button } from "@/shared/ui";
import { toast } from "@/shared/lib/toast";

export default function FriendRequestSendButton({
	userId,
}: {
	userId: number;
}) {
	const { user } = useAuth();

	const addFriendMutation = useMutation({
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

	if (!user?.id) return null;

	return (
		<Button
			variant={"black"}
			size="xl"
			className="bold-14 h-[45px] mobile:w-[218px] w-full mobile:rounded-xl rounded-[6px]"
			onClick={() => addFriendMutation.mutate()}
		>
			친구 추가
		</Button>
	);
}
