import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../../api/query-keys";
import { useBumpPost } from "../../api/use-bump-post";
import RefetchButton from "../refetch-button";
import CreatePostButton from "../create-post-button";
import HoistingIcon from "@/shared/assets/icons/ic-hoisting.svg?react";
import PositionButtons from "./position-buttons";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import { getGameModeTitle } from "../../lib/getGameModeTitle";
import {
	GAME_MODE_ITEMS,
	MIKE_ITEMS,
	TIER_ITEMS,
} from "../../config/dropdown-items";
import { useBoardFilterStore } from "../../model/board-filter-store";
import { useEffect } from "react";
import { getTierTitle } from "../../lib/getTierTitle";
import { getMike } from "../../lib/getMike";

export default function BoardToolbarMobile({
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

	const { gameMode, tier, mike, setFilter, resetFilters } =
		useBoardFilterStore();

	useEffect(() => {
		resetFilters();
	}, []);

	return (
		<div className="w-full  mt-3 flex flex-col">
			<div className="w-full flex flex-row items-center justify-between mb-3 px-5">
				<h2 className="bold-20 text-gray-700 w-full text-start">게시판</h2>

				<div className="flex items-center gap-2 h-[38px]">
					<button
						type="button"
						onClick={() => mutate()}
						className="text-white h-full px-3 py-2 bg-linear-to-tr from-violet-600 to-[#E02FC8] rounded-md"
					>
						<HoistingIcon className="w-3.5" />
					</button>
					<CreatePostButton onClick={handleOpenCreateModal} />
				</div>
			</div>
			<div className="w-full grid px-5 grid-rows-1 grid-cols-[1fr_auto] gap-x-2 mb-2">
				<PositionButtons />
				<RefetchButton onClick={refetchPost} />
			</div>
			<div className="w-full grid grid-rows-1 grid-cols-[114px_100px_89px] gap-x-2 px-5">
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
