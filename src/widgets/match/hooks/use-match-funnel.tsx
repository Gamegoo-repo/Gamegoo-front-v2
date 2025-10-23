import { useEffect, useState } from "react";
import { useAuthUser } from "@/shared/providers";
import type { FunnelStep } from "../lib/types";

export interface UseMatchFunnelReturn {
	step: FunnelStep;
	context: {
		type: "BASIC" | "CONDITIONAL";
		gameMode: "FAST" | "SOLO" | "FREE" | "ARAM";
		profile: {
			nickname: string;
			avatar: string;
			level: number;
			winRate: number;
			lossRate: number;
		};
	};
	toStep: (
		step: FunnelStep,
		newContext?: Partial<UseMatchFunnelReturn["context"]>,
	) => void;
}

export const useMatchFunnel = (): UseMatchFunnelReturn => {
	const { authUser } = useAuthUser();
	const [currentStep, setCurrentStep] = useState<FunnelStep>("match-type");
	const [context, setContext] = useState<UseMatchFunnelReturn["context"]>({
		type: "BASIC",
		gameMode: "FAST",
		profile: {
			nickname: "",
			avatar: "",
			level: 0,
			winRate: 0,
			lossRate: 0,
		},
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
			return;
		}

		setCurrentStep(step);
		const updatedContext = newContext ? { ...context, ...newContext } : context;
		setContext(updatedContext);

		sessionStorage.setItem("funnel-step", step);
		sessionStorage.setItem("funnel-context", JSON.stringify(updatedContext));
	};

	return {
		step: currentStep,
		context,
		toStep,
	};
};
