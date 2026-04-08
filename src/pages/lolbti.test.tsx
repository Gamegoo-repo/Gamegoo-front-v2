import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
	calculateAllAxisPercentages,
	calculateLolBtiResult,
	type LolBtiAxisKey,
	type LolBtiResultType,
	trackRollBtiEvent,
} from "@/features/lol-bti";
import { LOL_BTI_QUESTIONS } from "@/features/lol-bti/test/config";
import { useSaveGuestLolBtiResult } from "@/features/lol-bti/test/model/use-save-guest-lolbti-result";
import { useSaveMemberLolBtiResult } from "@/features/lol-bti/test/model/use-save-member-lolbti-result";
import LolBtiLandingSection from "@/features/lol-bti/test/ui/landing/lolbti-landing-section";
import LolBtiLoadingSection from "@/features/lol-bti/test/ui/lolbti-loading-section";
import LolBtiQuizSection from "@/features/lol-bti/test/ui/quiz/lolbti-quiz-section";
import LolBtiResultSection from "@/features/lol-bti/test/ui/result/lolbti-result-section";
import LolBtiShareButton from "@/features/lol-bti/test/ui/result/lolbti-share-button";
import { getEventSource } from "@/shared/lib/get-device";
import { SessionManager } from "@/shared/lib/session/session-manager";
import { useAuth } from "@/shared/model/use-auth";

export const Route = createFileRoute("/lolbti/test")({
	component: RouteComponent,
});

type QuizPhase = "landing" | "quiz" | "saving" | "result";

type SavedResult = {
	resultId: string;
	type: LolBtiResultType;
	axisPercentages: Record<LolBtiAxisKey, number>;
};

function RouteComponent() {
	const [phase, setPhase] = useState<QuizPhase>("landing");
	const [userAnswers, setUserAnswers] = useState<("A" | "B")[]>([]);
	const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const handleGoToLolBtiBoard = () => {
		trackRollBtiEvent({
			eventType: "GO_TO_GAMEGOO",
			sessionId: SessionManager.getOrCreateId(),
			eventSource: getEventSource(),
		});
		navigate({ to: "/lolbti" });
	};

	const { mutate: createPublicLolBtiResult } = useSaveGuestLolBtiResult();
	const { mutate: saveMemberLolBtiResult } = useSaveMemberLolBtiResult();

	useEffect(() => {
		Array.from({ length: 12 }, (_, i) => {
			const img = new Image();
			img.src = `/assets/images/question/${i + 1}.png`;
			return img;
		});
	}, []);

	const currentQuestion = userAnswers.length + 1;

	const handleSelectAnswer = (newAnswer: "A" | "B") => {
		const nextAnswers = [...userAnswers, newAnswer];
		setUserAnswers(nextAnswers);

		if (nextAnswers.length < LOL_BTI_QUESTIONS.length) {
			return;
		}

		const resultType = calculateLolBtiResult(nextAnswers);
		const axisPercentages = calculateAllAxisPercentages(nextAnswers);

		setPhase("saving");

		trackRollBtiEvent({
			eventType: "COMPLETE_TEST",
			sessionId: SessionManager.getOrCreateId(),
			eventSource: getEventSource(),
		});

		if (isAuthenticated) {
			saveMemberLolBtiResult(
				{
					type: resultType,
					resultPayload: axisPercentages,
					sessionId: SessionManager.getOrCreateId(),
				},
				{
					onSuccess: (data) => {
						const resolvedType = data.memberResult.type as LolBtiResultType;
						setSavedResult({
							resultId: data.resultId ?? "",
							type: resolvedType,
							axisPercentages,
						});
						setPhase("result");
					},
					onError: () => {
						SessionManager.setResultType(resultType);
						setSavedResult({ resultId: "", type: resultType, axisPercentages });
						setPhase("result");
					},
				},
			);
		} else {
			createPublicLolBtiResult(
				{
					type: resultType,
					resultPayload: axisPercentages,
					sessionId: SessionManager.getOrCreateId(),
				},
				{
					onSuccess: (data) => {
						const resolvedType = data.type as LolBtiResultType;
						// 회원가입 완료 이벤트 전송을 위해 저장
						SessionManager.setResultType(resolvedType);
						setSavedResult({
							resultId: data.resultId,
							type: resolvedType,
							axisPercentages,
						});
						setPhase("result");
					},
					onError: () => {
						SessionManager.setResultType(resultType);
						setSavedResult({ resultId: "", type: resultType, axisPercentages });
						setPhase("result");
					},
				},
			);
		}
	};

	const handleUndoAnswer = () => {
		if (currentQuestion === 1) {
			setPhase("landing");
			return;
		}
		setUserAnswers((prev) => prev.slice(0, -1));
	};

	if (phase === "landing") {
		return (
			<LolBtiLandingSection
				onStart={() => {
					// 세션ID 재발급
					const sessionId = SessionManager.reset();
					setPhase("quiz");
					trackRollBtiEvent({
						eventType: "START_TEST",
						sessionId,
						eventSource: getEventSource(),
					});
				}}
			/>
		);
	}

	if (phase === "saving") {
		return <LolBtiLoadingSection />;
	}

	if (phase === "result" && savedResult !== null) {
		return (
			<LolBtiResultSection
				lolBti={savedResult.type}
				resultId={savedResult.resultId}
				axisPercentages={savedResult.axisPercentages}
				footer={
					<>
						<button
							type="button"
							onClick={handleGoToLolBtiBoard}
							className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-violet-600 py-4 font-bold text-base text-white leading-none transition-all duration-300 hover:text-gray-300 active:scale-95"
						>
							나와 잘 맞는 유저를 찾고 싶다면?
						</button>
						<LolBtiShareButton result={savedResult.type} />
					</>
				}
			/>
		);
	}

	return (
		<LolBtiQuizSection
			currentQuestion={currentQuestion}
			onSelectAnswer={handleSelectAnswer}
			onUndoAnswer={handleUndoAnswer}
		/>
	);
}
