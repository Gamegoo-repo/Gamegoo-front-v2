import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../../api/query-keys";
import BoardFilter from "../board-filter";
import BumpButton from "../bump-button";
import CreatePostButton from "../create-post-button";
import RefetchButton from "../refetch-button";
import { useAuth } from "@/shared/model/use-auth";
import { useLoginRequiredModalStore } from "@/features/auth";

export default function BoardToolbarDesktop({
	handleOpenCreateModal,
}: {
	handleOpenCreateModal: () => void;
}) {
	const queryClient = useQueryClient();
	const { isAuthenticated } = useAuth();

	const openLoginRequiredModal = useLoginRequiredModalStore(
		(set) => set.openModal,
	);

	const handleOpenModal = () => {
		if (isAuthenticated) {
			handleOpenCreateModal();
		} else {
			openLoginRequiredModal();
		}
	};

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
