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
	isAuthenticated: boolean;
	page?: number;
	gameMode?: GameMode;
	tier?: Tier;
	mainP?: Position;
	subP?: Position;
	mike?: Mike;
}

export const useBoardList = ({
	isAuthenticated,
	...props
}: UseBoardListProps) => {
	return useQuery({
		queryKey: boardKeys.list(props),
		queryFn: async () => {
			const boardService = isAuthenticated
				? api.private.board
				: api.public.board;

			const response = await boardService.boardList(
				props.page || 1,
				props.gameMode,
				props.tier,
				props.mainP,
				props.subP,
				props.mike,
			);

			return response.data.data;
		},
		staleTime: 5 * 60 * 1000,
	});
};
