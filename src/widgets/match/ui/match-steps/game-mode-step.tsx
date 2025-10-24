import { GraphicButton } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../hooks";
import MatchHeader from "../match-header";

interface GameModeStepProps {
	funnel: UseMatchFunnelReturn;
}

function GameModeStep({ funnel }: GameModeStepProps) {
	return (
		<>
			<MatchHeader
				step="game-mode"
				title="게임 모드 선택"
				onBack={() => funnel.toStep("match-type")}
			/>
			<div className="flex justify-center p-10 items-center h-fit gap-[59px] max-[768px]:grid max-[768px]:grid-cols-2 max-[768px]:gap-4 max-[480px]:flex max-[480px]:flex-col max-[480px]:gap-4">
				<GraphicButton
					title="빠른 대전"
					height="156px"
					width="278px"
					hoverBackgroundColor="violet-600"
					onClick={() => {
						funnel.toStep("profile");
						funnel.context.gameMode = "FAST";
					}}
				/>
				<GraphicButton
					title="솔로랭크"
					height="156px"
					width="278px"
					hoverBackgroundColor="violet-600"
					onClick={() => {
						funnel.toStep("profile");
						funnel.context.gameMode = "SOLO";
					}}
				/>
				<GraphicButton
					title="자유랭크"
					height="156px"
					width="278px"
					hoverBackgroundColor="violet-600"
					onClick={() => {
						funnel.toStep("profile");
						funnel.context.gameMode = "FREE";
					}}
				/>
				{funnel.context.type === "BASIC" && (
					<GraphicButton
						title="칼바람"
						height="156px"
						width="278px"
						hoverBackgroundColor="violet-600"
						onClick={() => {
							funnel.toStep("profile");
							funnel.context.gameMode = "ARAM";
						}}
					/>
				)}
			</div>
		</>
	);
}

export default GameModeStep;
