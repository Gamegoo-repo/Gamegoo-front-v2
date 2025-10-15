import { useEffect, useState } from "react";
import type { FunnelStep } from "../lib/types";

export const useMatchFunnel = () => {
	const [currentStep, setCurrentStep] = useState<FunnelStep>("type");
	const [context, setContext] = useState<Record<string, unknown>>({});

	useEffect(() => {
		const savedStep = sessionStorage.getItem("funnel-step");
		const savedContext = sessionStorage.getItem("funnel-context");

		if (savedStep && savedContext) {
			setCurrentStep(savedStep as FunnelStep);
			setContext(JSON.parse(savedContext));
		}
	}, []);

	const toStep = (step: FunnelStep, newContext?: Record<string, unknown>) => {
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
