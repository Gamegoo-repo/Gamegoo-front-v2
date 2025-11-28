import type { ReactNode } from "react";
import CheckIcon from "@/shared/assets/icons/ic-manner-check.svg?react";
import { STEPPER_COLORS } from "../config/stepper-colors";

interface StepperStepProps {
	currentLevel: number; // 맵핑 중인 현재 레벨 숫자 (1~5)
	userLevel: number; // 유저의 실제 레벨
	rankPercentile: number | undefined;
}
export default function StepperStep({
	currentLevel,
	userLevel,
	rankPercentile,
}: StepperStepProps) {
	if (currentLevel > userLevel) {
		return <UnCheckedStepItem key={currentLevel} level={currentLevel} />;
	} else if (currentLevel === userLevel) {
		// 유저의 현재 레벨인 노드의 경우
		return (
			<div className="relative flex flex-col">
				<CheckedStepItem key={currentLevel} level={currentLevel}>
					<div
						className="bold-11 -top-14 -translate-y-[100%] absolute flex flex-col items-center text-nowrap"
						style={{
							color:
								currentLevel > 3
									? STEPPER_COLORS[currentLevel - 1]
									: STEPPER_COLORS[1],
						}}
					>
						{rankPercentile && (
							<>
								<span>상위 {rankPercentile}%</span>
								<div
									className="h-0 w-0 border-x-4 border-x-transparent border-t-8"
									style={{
										borderTopColor:
											currentLevel > 3
												? STEPPER_COLORS[currentLevel - 1]
												: STEPPER_COLORS[1],
									}}
								/>
							</>
						)}
					</div>
				</CheckedStepItem>
			</div>
		);
	} else {
		return <CheckedStepItem key={currentLevel} level={currentLevel} />;
	}
}

const CheckedStepItem = ({
	level,
	children,
}: {
	level: number;
	children?: ReactNode;
}) => {
	return (
		<li className="relative flex flex-col items-center justify-center">
			<LevelText level={level} />
			{children}
			<div
				className="flex h-10 w-10 items-center justify-center rounded-full"
				style={{ backgroundColor: STEPPER_COLORS[level - 1] }}
			>
				<CheckIcon />
			</div>
		</li>
	);
};

const UnCheckedStepItem = ({ level }: { level: number }) => {
	return (
		<li className="relative flex flex-col items-center justify-center">
			<span className="bold-14 -top-2 -translate-y-[100%] absolute inline-block text-nowrap text-gray-800">
				Lv {level}
			</span>
			<div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-[5px] border-gray-800 bg-gray-100 p-0.5" />
		</li>
	);
};

const LevelText = ({ level }: { level: number }) => {
	return (
		<span className="bold-14 -top-2 -translate-y-[100%] absolute text-violet-400">
			Lv {level}
		</span>
	);
};
