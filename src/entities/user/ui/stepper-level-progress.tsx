import type { ReactNode } from "react";
import CheckIcon from "@/shared/assets/icons/ic-manner-check.svg?react";
import { cn } from "@/shared/lib/utils";

const STEPPER_COLORS = ["#C1B7FF", "#9F90F9", "#7B65FF", "#5A42EE", "#452AEA"]; //violet-300 ~ violet-700

export default function StepperLevelProgress({
	userLevel,
	rankPercentile,
}: {
	userLevel: number; // 1 ~ 5
	rankPercentile: number | undefined;
}) {
	const LEVEL_NUMBERS = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]
	const progressPercent = ((userLevel - 1) / 4) * 100;
	return (
		<div className="w-full progress flex items-center justify-between">
			<div
				className={cn(
					"progress-bar w-full px-5 flex h-1",
					userLevel < 5 && "pr-[9px]",
				)}
			>
				<div
					className="left-5 h-full"
					style={{
						width: `${progressPercent}%`,
						background: `linear-gradient(to right, #DBD6FE, ${STEPPER_COLORS[userLevel - 1]})`,
					}}
				/>
				<div
					className="bg-black h-full"
					style={{
						width: `${100 - progressPercent}%`,
					}}
				/>
			</div>

			<ol className="progress-items w-full">
				{LEVEL_NUMBERS.map((num) => {
					// 유저 레벨보다 높은 노드들의 경우
					if (num > userLevel) {
						return <UnCheckedStepItem key={num} level={num} />;
					} else if (num === userLevel) {
						// 유저의 현재 레벨인 노드의 경우
						return (
							<div className="flex flex-col relative">
								<CheckedStepItem key={num} level={num}>
									<div
										className="absolute bold-11 -top-14 -translate-y-[100%] text-nowrap flex flex-col items-center"
										style={{
											color:
												num > 3 ? STEPPER_COLORS[num - 1] : STEPPER_COLORS[1],
										}}
									>
										{rankPercentile && (
											<>
												<span>상위 {rankPercentile}%</span>
												<div
													className="w-0 h-0 border-x-4 border-x-transparent border-t-8"
													style={{
														borderTopColor:
															num > 3
																? STEPPER_COLORS[num - 1]
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
						return <CheckedStepItem key={num} level={num} />;
					}
				})}
			</ol>
		</div>
	);
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
				className="w-10 h-10 flex items-center justify-center rounded-full"
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
			<span className="inline-block absolute bold-14 -top-2 -translate-y-[100%] text-gray-800 text-nowrap">
				Lv {level}
			</span>
			<div className="p-0.5 w-[20px] h-[20px] flex items-center justify-center rounded-full bg-gray-100 border-[5px] border-gray-800 shrink-0" />
		</li>
	);
};

const LevelText = ({ level }: { level: number }) => {
	return (
		<span className="absolute bold-14 -top-2 -translate-y-[100%] text-violet-400">
			Lv {level}
		</span>
	);
};
