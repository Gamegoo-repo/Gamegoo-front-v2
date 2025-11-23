import type { AddEventHandlerArgs, ToastEventCallbackMap } from "./types";

export const toastEventManager = (() => {
	const eventCallbackList = new Map<keyof ToastEventCallbackMap, any>();

	return {
		addEventHandler<K extends keyof ToastEventCallbackMap>({
			eventType,
			callback,
		}: AddEventHandlerArgs<K>) {
			eventCallbackList.set(eventType, callback);
		},

		trigger<K extends keyof ToastEventCallbackMap>(eventType: K, ...args: any) {
			if (!eventCallbackList.has(eventType)) {
				throw new Error(
					`토스트 이벤트 핸들러에 등록된 ${eventType} 이벤트가 없습니다. 이벤트 등록 후 호출해주세요.`,
				);
			}

			const callback = eventCallbackList.get(eventType);
			callback(...args);
		},
	};
})();

// export default toastEventManager;
