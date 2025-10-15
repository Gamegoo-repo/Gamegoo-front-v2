import { useRouter } from "@tanstack/react-router";
import { GraphicButton } from "@/shared/ui";
import { useMatchFunnel } from "../hooks/use-match-funnel";
import MatchHeader from "./match-header";

function MatchComponent() {
	const funnel = useMatchFunnel();
	const router = useRouter();

	// Step 1: 게임 모드 선택
	if (funnel.step === "type") {
		return (
			<>
				<MatchHeader
					step="type"
					title="매칭 종류 선택"
					onBack={() => router.navigate({ to: "/" })}
				/>
				<div className="flex justify-center items-center h-fit gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
					<GraphicButton
						title="겜구 매칭"
						subtitle="간단한 조건으로 빠르게"
						height="276px"
						width="600px"
						hoverBackgroundColor="violet-600"
						hoverText={{
							title: "빠르게 게임을 시작하고 싶다면",
							subtitle: "간단한 조건만 맞으면 바로 매칭돼요",
						}}
					/>
					<GraphicButton
						title="맞춤 매칭"
						subtitle="원하는 조건에 딱 맞게"
						height="276px"
						width="600px"
						hoverBackgroundColor="violet-600"
						hoverText={{
							title: "완벽한 게임 친구를 만나고 싶다면",
							subtitle: "원하는 조건에 맞는 친구를 찾아드려요 *매칭 시간 소요",
						}}
					/>
				</div>
			</>
		);
	}

	return <div>Loading...</div>;
}

export default MatchComponent;
