import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedAction } from "@/shared/hooks/use-authenticated-action";
import { boardKeys } from "../../api/query-keys";
import BoardFilter from "../board-filter";
import BumpButton from "../bump-button";
import CreatePostButton from "../create-post-button";
import RefetchButton from "../refetch-button";

export default function BoardToolbarDesktop({
	handleOpenCreateModal,
}: {
	handleOpenCreateModal: () => void;
}) {
	const queryClient = useQueryClient();
	const handleOpenModal = useAuthenticatedAction(handleOpenCreateModal);

	const refetchPost = async () => {
		await queryClient.refetchQueries({
			queryKey: boardKeys.all,
			type: "active",
		});
	};

	return (
		<div className="mt-[60px] mb-8 flex w-full flex-col">
			<div className="mb-8 flex w-full flex-row items-center justify-between">
				<h2 className="w-full text-start font-bold text-[32px] text-gray-700">
					게시판
				</h2>
				<RefetchButton onClick={refetchPost} />
			</div>
			<div className="flex h-[58px] w-full items-center justify-between">
				<BoardFilter />
				<div className="flex h-full items-center gap-6">
					<BumpButton />
					{/** TODO: 중복 로직 제거하기 */}
					<CreatePostButton onClick={handleOpenModal} />
				</div>
			</div>
		</div>
	);
}
