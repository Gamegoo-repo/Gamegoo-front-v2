import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type ReactLazyFactory<T = any> = () => Promise<{
	default: ComponentType<T>;
}>;

export type ComponentPreloadTuple<T = any> = [
	component: LazyExoticComponent<ComponentType<T>>,
	preload: () => Promise<void>,
];

export function getLazyComponentWithPreload<T = any>(
	factory: ReactLazyFactory<T>,
): ComponentPreloadTuple<T> {
	let modulePromise: Promise<{ default: ComponentType<T> }> | null = null;

	// ✅ Memoized factory - 중복 호출 방지
	const memoizedFactory = () => {
		if (!modulePromise) {
			modulePromise = factory();
		}
		return modulePromise;
	};

	const preload = async (): Promise<void> => {
		try {
			await memoizedFactory();
		} catch (error) {
			// 에러를 조용히 처리 - lazy component가 다시 시도할 것임
			console.warn("Component preload failed:", error);
			// Promise를 리셋하여 다시 시도 가능하게 함
			modulePromise = null;
		}
	};

	return [lazy(memoizedFactory), preload];
}
