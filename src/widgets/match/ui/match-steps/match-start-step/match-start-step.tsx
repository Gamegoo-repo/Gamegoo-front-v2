import { useEffect, useRef, useState } from "react";
import { toast } from "@/shared/lib/toast";
import type { UseMatchFunnelReturn } from "@/widgets/match/hooks";
import { matchFlow } from "@/widgets/match/lib/match-flow";
import type { MatchingCountData } from "@/widgets/match/lib/matching-types";
import MatchHeader from "../../match-header";
import MatchLoadingCard from "./match-loading-card";
import MatchStartProfile from "./match-start-profile";
import { useMatchUiStore } from "@/widgets/match/model/store/useMatchUiStore";

const MAX_MATCHING_TIME = 300; // 5분
const RETRY_INTERVAL_SEC = 30; // 30초

interface MatchStartStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchStartStep({ funnel }: MatchStartStepProps) {
	const { timeLeft, isMatching } = useMatchUiStore();
	const [tierCounts, setTierCounts] = useState<Record<string, number>>({});

	const sessionIdRef = useRef(0);
	const authUser = funnel.user;

	const lastRetryMarkRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isMatching) return;
		if (timeLeft <= 0) return;

		/** 남은시간이 300, 270, 240... 이런 지점에서 retry 하던 로직을
		 *  매 30초로 유지하려면 elapsed 기반이 필요하지만
		 * 	간다히 timeleft로 체크
		 **/

		const mod = timeLeft % RETRY_INTERVAL_SEC;
		const mark = timeLeft; // 현재 timeLeft 자체를 마크로 사용

		if (mod === 0 && lastRetryMarkRef.current !== mark) {
			lastRetryMarkRef.current = mark;

			if (timeLeft < MAX_MATCHING_TIME) matchFlow.retryTick(1.5);
		}
	}, [timeLeft, isMatching]);

	useEffect(
		() => {
			const handleMatchingCount = (data: unknown) => {
				const d = data as MatchingCountData;
				const newTierCounts = {
					...d.data.tierCount,
					total: d.data.userCount,
				};
				setTierCounts(newTierCounts);
			};

			const handleMatchingNotFound = () => {
				// 서버 이벤트로 매칭이 종료되면 matchFlow 내부 상태를 초기화해야
				// 다음 매칭 시작 시 matching-request가 정상 전송됩니다.
				matchFlow.reset();
				funnel.toStep("profile");
			};

			const handleMatchingFail = () => {
				matchFlow.reset();
				toast.error("매칭에 실패했어요. 다시 시도해 주세요.");
				funnel.toStep("profile");
			};

			// 이벤트 구독 (matchFlow 관리)
			matchFlow.on("matching-count", handleMatchingCount);
			matchFlow.on("matching-not-found", handleMatchingNotFound);
			matchFlow.on("matching-fail", handleMatchingFail);

			sessionIdRef.current = matchFlow.getSessionId();

			return () => {
				matchFlow.off("matching-count", handleMatchingCount);
				matchFlow.off("matching-not-found", handleMatchingNotFound);
				matchFlow.off("matching-fail", handleMatchingFail);
			};
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const handleBack = () => {
		// 매칭 취소 이벤트 전송
		matchFlow.cancel(sessionIdRef.current);
		// 프로필 단계로 이동
		funnel.toStep("profile");
	};

	return (
		<>
			<MatchHeader
				title="매칭 중"
				subtitle="나와 꼭 맞는 상대를 찾는 중..."
				onBack={handleBack}
			/>
			<div className="flex w-full items-center justify-center">
				<div className="w-full max-w-[1440px]">
					<div className="mobile:mt-[70px] mt-[0px] mb-[150px] flex w-full items-center justify-center gap-[59px] mobile:px-[0px] px-[10px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
						<MatchStartProfile
							user={{
								...authUser,
								mike: funnel.profile?.mike,
								mainP: funnel.profile?.mainP,
								subP: funnel.profile?.subP,
								wantP: funnel.profile?.wantP,
								gameStyleResponseList: funnel.profile?.gameStyleResponseList,
							}}
						/>
						<MatchLoadingCard
							timeLeft={timeLeft}
							tierCounts={tierCounts}
							userTier={authUser?.soloTier ?? "UNRANKED"}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default MatchStartStep;
