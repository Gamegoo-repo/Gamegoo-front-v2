import { GAME_STYLE } from "@/features/board/config/game-styles";

export const getGameStyle = (styleId: number) => {
	const game = GAME_STYLE.find((style) => style.gameStyleId === styleId);
	return game ? game.gameStyleName : "오류";
};
