import { useEffect, useState } from "react";
import { toastEventManager } from "./event-manager";
import {
	TOAST_EVENT,
	type ToastArgs,
	type ToastMessage,
	type ToastOptions,
} from "./types";

const DEFAULT_TIME = 3000;

export const useToast = () => {
	const [currentToast, setCurrentToast] = useState<ToastArgs | null>(null);

	const showToast = (message: ToastMessage, options: ToastOptions) => {
		setCurrentToast({ message, options });
	};

	const closeToast = () => {
		setCurrentToast(null);
	};

	const setAutoCloseTimer = () => {
		if (!currentToast) return;

		const showingTime = currentToast.options.showingTime || DEFAULT_TIME;
		const timer = setTimeout(() => setCurrentToast(null), showingTime);

		return () => clearTimeout(timer);
	};

	useEffect(() => {
		if (currentToast?.options.isAutoClosed) setAutoCloseTimer();

		return;
	}, [currentToast]);

	useEffect(() => {
		toastEventManager.addEventHandler({
			eventType: TOAST_EVENT.show,
			callback: showToast,
		});
	}, []);

	return {
		currentToast,
		closeToast,
	};
};
