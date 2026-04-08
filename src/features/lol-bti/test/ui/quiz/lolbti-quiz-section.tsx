import { FlexBox } from "@/shared/ui/flexbox";
import { LOL_BTI_QUESTIONS } from "../../config";
import { LolBtiLayout } from "../lolbti-layout";
import { LolBtiOptionButton } from "./lolbti-option-button";

interface LolBtiQuizSectionProps {
	currentQuestion: number;
	onSelectAnswer: (answer: "A" | "B") => void;
	onUndoAnswer: () => void;
}

export default function LolBtiQuizSection({
	currentQuestion,
	onSelectAnswer,
	onUndoAnswer,
}: LolBtiQuizSectionProps) {
	const totalProblems = 12;

	return (
		<LolBtiLayout>
			<FlexBox
				direction="column"
				align="center"
				gap="xs"
				className="w-full p-7"
			>
				<header className="relative flex w-full items-center justify-center p-1.5">
					<button
						type="button"
						onClick={onUndoAnswer}
						className="-translate-y-1/2 absolute top-1/2 left-4 flex cursor-pointer items-center justify-center"
					>
						<span className="chev-icon"></span>
					</button>
					<h3 className="font-semibold text-[#888] text-base">
						<span className="text-white">{currentQuestion}</span> / 12
					</h3>
				</header>
				<div className="h-2 w-[54%] rounded-full bg-white/10">
					<div
						style={{ width: `${(currentQuestion / totalProblems) * 100}%` }}
						className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-blue-60,#5A42EE)_0%,var(--color-blue-70,#7A66FF)_100%))] shadow-[0_0_20px_0_rgba(90,66,238,0.5)] transition-all duration-300"
					/>
				</div>
				<FlexBox direction="column" gap="md" align="center" asChild>
					<section className="w-full pt-4 pb-8">
						<div className="h-fit w-full overflow-hidden rounded-xl px-5">
							<img
								alt={`질문 ${currentQuestion}`}
								src={`/assets/images/question/${currentQuestion}.png`}
								className="w-full rounded-xl object-cover"
							/>
						</div>

						<article className="min-h-[3.5rem] whitespace-pre-line break-keep text-center font-semibold text-white text-xl">
							{LOL_BTI_QUESTIONS[currentQuestion - 1].question}
						</article>
						<p className="flex w-full flex-col gap-4 pt-3">
							<LolBtiOptionButton
								label="A"
								text={LOL_BTI_QUESTIONS[currentQuestion - 1].optionA}
								onSelectOption={() => onSelectAnswer("A")}
							/>

							<LolBtiOptionButton
								label="B"
								text={LOL_BTI_QUESTIONS[currentQuestion - 1].optionB}
								onSelectOption={() => onSelectAnswer("B")}
							/>
						</p>
					</section>
				</FlexBox>
			</FlexBox>
		</LolBtiLayout>
	);
}
