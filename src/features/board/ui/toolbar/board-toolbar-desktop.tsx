import { useQueryClient } from "@tanstack/react-query";
import { useBumpPost } from "../../api/use-bump-post";
import BoardFilter from "../board-filter";
import BumpButton from "../bump-button";
import RefetchButton from "../refetch-button";
import { boardKeys } from "../../api/query-keys";
import CreatePostButton from "../create-post-button";

export default function BoardToolbarDesktop({
	handleOpenCreateModal,
}: {
	handleOpenCreateModal: () => void;
}) {
	const { mutate } = useBumpPost();
	const queryClient = useQueryClient();

	const refetchPost = async () => {
		await queryClient.refetchQueries({
			queryKey: boardKeys.all,
			type: "active",
		});
	};

	return (
		<div className="w-full  mt-[60px] mb-8 flex flex-col">
			<div className="w-full flex flex-row items-center justify-between mb-8">
				<h2 className="text-[32px] text-gray-700 font-bold w-full text-start">
					게시판
				</h2>
				<RefetchButton onClick={refetchPost} />
			</div>
			<div className="w-full flex items-center justify-between h-[58px]">
				<BoardFilter />
				<div className="flex gap-6 items-center h-full">
					<BumpButton onClick={() => mutate()} />
					<CreatePostButton onClick={handleOpenCreateModal} />
				</div>
			</div>
		</div>
	);
}
