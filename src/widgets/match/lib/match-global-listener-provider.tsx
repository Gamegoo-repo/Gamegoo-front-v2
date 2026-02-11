import { useEffect } from "react";
import { useMatchFunnelStore } from "../hooks";
import { matchFlow } from "./match-flow";
import { useRouter } from "@tanstack/react-router";

export const MatchGlobalListenerProvider = () => {
	const router = useRouter();
	const { setStep } = useMatchFunnelStore.getState();

	useEffect(() => {
		const handleNavigateMatchingPage = () => {
			router.navigate({ to: "/match" });
		};

		const offSender = matchFlow.on("matching-found-sender", (event) => {
			matchFlow.beginCompletePhase();
			handleNavigateMatchingPage();
			setStep("match-complete", {
				matchComplete: {
					role: "sender",
					opponent: event.data,
					matchingUuid: event.data.matchingUuid,
				},
			});
		});

		const offReciever = matchFlow.on("matching-found-receiver", (event) => {
			matchFlow.beginCompletePhase();
			matchFlow.confirmFoundReceiver(
				event.data.senderMatchingInfo.matchingUuid,
			);
			handleNavigateMatchingPage();
			setStep("match-complete", {
				matchComplete: {
					role: "receiver",
					opponent: event.data.senderMatchingInfo,
					matchingUuid: event.data.senderMatchingInfo.matchingUuid,
				},
			});
		});

		const offFail = matchFlow.on("matching-fail", () => {
			matchFlow.reset();
			handleNavigateMatchingPage();
			setStep("profile");
		});

		const offNotFound = matchFlow.on("matching-not-found", () => {
			matchFlow.reset();
			handleNavigateMatchingPage();
			setStep("profile");
		});

		return () => {
			offSender();
			offReciever();
			offFail();
			offNotFound();
		};
	}, [router]);
	return null;
};
