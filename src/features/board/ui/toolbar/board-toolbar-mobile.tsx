import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedAction } from "@/shared/hooks/use-authenticated-action";
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
import BumpButton from "../bump-button";
import CreatePostButton from "../create-post-button";
import RefetchButton from "../refetch-button";
import PositionButtons from "./position-buttons";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { Position } from "@/shared/api";

export default function BoardToolbarMobile({
	handleOpenCreateModal,
}: {
	handleOpenCreateModal: () => void;
}) {
	const queryClient = useQueryClient();

	const refetchPost = async () => {
		await queryClient.refetchQueries({
			queryKey: boardKeys.all,
			type: "active",
		});
	};

	const navigate = useNavigate({ from: "/board" });
	const search = useSearch({ from: "/_header-layout/board/" });
	const { mode, tier, mike, position } = search;

	const updateFilter = <K extends keyof typeof search>(
		key: K,
		value: (typeof search)[K],
	) => {
		navigate({
			to: ".",
			search: {
				...search,
				[key]: value,
			},
			replace: true,
		});
	};

	const handleOpenModal = useAuthenticatedAction(handleOpenCreateModal);

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
					<PositionButtons
						selectedPosition={position}
						onSelectPosition={(value) =>
							updateFilter("position", value as Position)
						}
					/>
				</div>
				<RefetchButton onClick={refetchPost} />
			</div>
			<div className="grid w-full grid-cols-[114px_104px_89px] grid-rows-1 gap-x-2 px-5">
				<Dropdown
					selectedLabel={getGameModeTitle(mode)}
					onSelect={(value) => updateFilter("mode", value)}
					items={GAME_MODE_ITEMS}
				/>
				<Dropdown
					selectedLabel={getTierTitle(tier)}
					onSelect={(value) => updateFilter("tier", value)}
					items={TIER_ITEMS}
				/>
				<Dropdown
					selectedLabel={getMike(mike)}
					onSelect={(value) => updateFilter("mike", value)}
					items={MIKE_ITEMS}
				/>
			</div>
		</div>
	);
}
