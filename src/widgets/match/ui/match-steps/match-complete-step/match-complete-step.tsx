import { useEffect, useState } from "react";
import { useSocketMessage, useSocketSend } from "@/shared/api/socket";
import type { UseMatchFunnelReturn } from "../../../hooks";
import type { MatchingSuccessData } from "../../../lib/matching-types";
import MatchHeader from "../../match-header";

const MATCHING_COMPLETE_TIME = 10; // 10초

interface MatchCompleteStepProps {
	funnel: UseMatchFunnelReturn;
}

function MatchCompleteStep({ funnel }: MatchCompleteStepProps) {
	const [timeLeft, setTimeLeft] = useState(MATCHING_COMPLETE_TIME);
	const [isAccepted, setIsAccepted] = useState(false);
	const { send } = useSocketSend();

	const matchComplete = funnel.context.matchComplete;

	// ✅ 매칭 성공 최종 처리
	useSocketMessage<MatchingSuccessData>("matching-success-final", (data) => {
		console.log("🎉 최종 매칭 성공:", data);
		// TODO: 채팅방 오픈
	});

	// ✅ 매칭 실패
	useSocketMessage("matching-fail", () => {
		console.warn("❌ 매칭 실패");
		// TODO: 실패 모달
	});

	// ✅ 서버 승인 이벤트 수신 후 success emit
	useSocketMessage("matching-allow", () => {
		if (!matchComplete) return;
		const { role, matchingUuid } = matchComplete;
		if (role === "sender") {
			send("matching-success-sender");
		} else {
			send("matching-success-receiver", { senderMatchingUuid: matchingUuid });
		}
	});

	// ✅ 타이머
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				const newTime = prev - 1;
				if (newTime <= 0) {
					send("matching-fail");
					clearInterval(timer);
				}
				return newTime;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [send]);

	if (!matchComplete) {
		return (
			<div className="text-center p-10">
				<p className="text-red-500">매칭 데이터를 찾을 수 없습니다.</p>
			</div>
		);
	}

	const { role, opponent, matchingUuid } = matchComplete;

	const handleAccept = () => {
		setIsAccepted(true);
		// ✅ 즉시 success를 보내지 않고 서버 승인 이벤트를 기다림
		send("matching-accept", { role, matchingUuid });
	};

	const handleReject = () => {
		send("matching-reject");
		funnel.toStep("profile");
	};

	return (
		<>
			<MatchHeader
				step="match-complete"
				title="매칭 완료"
				subtitle="상대방의 응답을 기다리는 중..."
				onBack={() => funnel.toStep("profile")}
			/>
			<div className="flex justify-center p-10 items-center h-fit gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">매칭 상대 발견!</h2>
					<div className="bg-gray-100 p-4 rounded-lg">
						<p className="text-lg font-semibold">
							{opponent.gameName}#{opponent.tag}
						</p>
						<p className="text-sm text-gray-600">티어: {opponent.tier}</p>
						<p className="text-sm text-gray-600">
							포지션: {opponent.mainP} / {opponent.subP}
						</p>
					</div>
					<div className="mt-4">
						<p className="text-sm text-gray-500">
							{timeLeft}초 후 자동으로 매칭이 취소됩니다
						</p>
					</div>
					{!isAccepted && (
						<div className="mt-6 flex gap-4 justify-center">
							<button
								type="button"
								onClick={handleAccept}
								className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
							>
								수락
							</button>
							<button
								type="button"
								onClick={handleReject}
								className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
							>
								거부
							</button>
						</div>
					)}
					{isAccepted && (
						<div className="mt-6">
							<p className="text-green-600 font-semibold">
								매칭 수락됨! 상대방의 응답을 기다립니다...
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

export default MatchCompleteStep;
