import { useQueryClient } from "@tanstack/react-query";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import { boardKeys } from "../../api/query-keys";
import {
	GAME_MODE_ITEMS,
	MIKE_ITEMS,
	TIER_ITEMS,
} from "../../config/dropdown-items";
import { getGameModeTitle } from "../../lib/getGameModeTitle";
import { getMike } from "../../lib/getMike";
import { getTierTitle } from "../../lib/getTierTitle";
import { useBoardFilterStore } from "../../model/board-filter-store";
import CreatePostButton from "../create-post-button";
import RefetchButton from "../refetch-button";
import PositionButtons from "./position-buttons";
import BumpButton from "../bump-button";
import { useLoginRequiredModalStore } from "@/features/auth";
import { useAuth } from "@/shared/model/use-auth";

export default function BoardToolbarMobile({
	handleOpenCreateModal,
}: {
	handleOpenCreateModal: () => void;
}) {
	const queryClient = useQueryClient();
	const { isAuthenticated } = useAuth();

	const openLoginRequiredModal = useLoginRequiredModalStore(
		(set) => set.openModal,
	);

	const refetchPost = async () => {
		await queryClient.refetchQueries({
			queryKey: boardKeys.all,
			type: "active",
		});
	};

	const { gameMode, tier, mike, setFilter } = useBoardFilterStore();

	const handleOpenModal = () => {
		if (isAuthenticated) {
			handleOpenCreateModal();
		} else {
			openLoginRequiredModal();
		}
	};

	return (
		<div className="mt-3 flex w-full flex-col">
			<div className="mb-3 flex w-full flex-row items-center justify-between px-5">
				<h2 className="bold-20 w-full text-start text-gray-700">게시판</h2>

				<div className="flex h-[38px] items-center gap-2">
					<BumpButton />
					<CreatePostButton onClick={handleOpenModal} />
				</div>
			</div>
			<div className="mb-2 grid w-full grid-cols-[1fr_auto] grid-rows-1 gap-x-2 px-5">
				<div className="max-w-[284px] flex-1">
					<PositionButtons />
				</div>
				<RefetchButton onClick={refetchPost} />
			</div>
			<div className="grid w-full grid-cols-[114px_100px_89px] grid-rows-1 gap-x-2 px-5">
				<Dropdown
					size="md"
					selectedLabel={getGameModeTitle(gameMode)}
					onSelect={(value) => setFilter("gameMode", value)}
					items={GAME_MODE_ITEMS}
				/>
				<Dropdown
					size="md"
					selectedLabel={getTierTitle(tier)}
					onSelect={(value) => setFilter("tier", value)}
					items={TIER_ITEMS}
				/>
				<Dropdown
					size="md"
					selectedLabel={getMike(mike)}
					onSelect={(value) => setFilter("mike", value)}
					items={MIKE_ITEMS}
				/>
			</div>
		</div>
	);
}
