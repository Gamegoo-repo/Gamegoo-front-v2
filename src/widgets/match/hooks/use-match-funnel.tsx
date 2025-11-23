import { useEffect, useState } from "react";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { useLoginRequiredModalStore } from "@/features/auth";
import type { MyProfileResponse } from "@/shared/api";
import type { FunnelStep } from "../lib/types";

export interface UseMatchFunnelReturn {
	user: MyProfileResponse | null;
	step: FunnelStep;
	context: {
		type: "BASIC" | "PRECISE" | null;
		gameMode: "FAST" | "SOLO" | "FREE" | "ARAM" | null;
		profile: Partial<MyProfileResponse> | null;
		matchComplete?: {
			role: "sender" | "receiver";
			opponent: {
				gameName: string;
				tag: string;
				tier: string;
				mainP: string;
				subP: string;
			};
			matchingUuid: string;
		};
	};
	toStep: (
		step: FunnelStep,
		newContext?: Partial<UseMatchFunnelReturn["context"]>,
	) => void;
}

export const useMatchFunnel = (): UseMatchFunnelReturn => {
	const { data: user } = useFetchMyInfo();
	const { openModal: openLoginRequiredModal } = useLoginRequiredModalStore();
	const [currentStep, setCurrentStep] = useState<FunnelStep>("profile");
	const [context, setContext] = useState<UseMatchFunnelReturn["context"]>({
		type: "BASIC",
		gameMode: "FAST",
		profile: null,
	});

	useEffect(() => {
		const savedStep = sessionStorage.getItem("funnel-step");
		const savedContext = sessionStorage.getItem("funnel-context");

		if (savedStep && savedContext) {
			setCurrentStep(savedStep as FunnelStep);
			setContext(JSON.parse(savedContext));
		}
	}, []);

	const toStep = (
		step: FunnelStep,
		newContext?: Partial<UseMatchFunnelReturn["context"]>,
	) => {
		if (!user) {
			openLoginRequiredModal();
			return;
		}

		setCurrentStep(step);
		setContext((prevContext) => {
			const updatedContext = newContext
				? { ...prevContext, ...newContext }
				: prevContext;
			sessionStorage.setItem("funnel-step", step);
			sessionStorage.setItem("funnel-context", JSON.stringify(updatedContext));
			return updatedContext;
		});
	};

	return {
		user: user || null,
		step: currentStep,
		context,
		toStep,
	};
};
