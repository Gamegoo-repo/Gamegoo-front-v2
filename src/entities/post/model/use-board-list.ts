import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/api/query-keys";
import {
	api,
	type GameMode,
	type Mike,
	type Position,
	type Tier,
} from "@/shared/api";

interface UseBoardListProps {
	page?: number;
	gameMode?: GameMode;
	tier?: Tier;
	mainP?: Position;
	subP?: Position;
	mike?: Mike;
}

export const useBoardList = (props: UseBoardListProps) => {
	const query = useQuery({
		queryKey: boardKeys.list(props),
		queryFn: () =>
			api.public.board.boardList(
				props.page || 1,
				props.gameMode,
				props.tier,
				props.mainP,
				props.subP,
				props.mike,
			),
		staleTime: 5 * 60 * 1000,
	});

	/** TODO: data. 반복 확인하기 */
	return {
		...query,
		boards: query.data?.data.data?.boards,
		totalPages: query.data?.data.data?.totalPages,
		totalElements: query.data?.data.data?.totalElements,
	};
};
