import { useEffect, useState } from "react";
import { useLoginRequiredModalStore } from "@/features/auth";
import type { MyProfileResponse } from "@/shared/api";
import { useAuthUser } from "@/shared/providers";
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
	const { authUser } = useAuthUser();
	const { openModal: openLoginRequiredModal } = useLoginRequiredModalStore();
	const [currentStep, setCurrentStep] = useState<FunnelStep>("match-type");
	const [context, setContext] = useState<UseMatchFunnelReturn["context"]>({
		type: null,
		gameMode: null,
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
		if (!authUser) {
			openLoginRequiredModal();
			return;
		}

		setCurrentStep(step);
		const updatedContext = newContext ? { ...context, ...newContext } : context;
		setContext(updatedContext);

		sessionStorage.setItem("funnel-step", step);
		sessionStorage.setItem("funnel-context", JSON.stringify(updatedContext));
	};

	return {
		user: authUser,
		step: currentStep,
		context,
		toStep,
	};
};
