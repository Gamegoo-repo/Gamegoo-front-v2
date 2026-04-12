import { useRef, useCallback, useEffect, useState } from "react";
import type { SnapPoint } from "./types";
import {
	DEFAULT_HALF_RATIO,
	VELOCITY_THRESHOLD,
	SNAP_EASING,
	SNAP_DURATION_MS,
} from "./constants";

/** `UseBottomSheetOptions`
 * - 훅의 사용처에서 전달하는 옵션
 */
interface UseBottomSheetOptions {
	/** `isOpen`: 바텀시트가 열려있는지 */
	isOpen: boolean;
	/** `onClose`: 바텀시트가 닫히면 부모에게 알려주는 함수 */
	onClose: () => void;
	/** `halfRatio`: 하프 사이즈 비율 */
	halfRatio?: number;
}

/** `UseBottomSheetReturn`
 * - 훅이 반환하는 값
 */
interface UseBottomSheetReturn {
	/** `sheetRef`: 바텀시트 DOM에 붙일 ref */
	sheetRef: React.RefObject<HTMLDivElement | null>;
	/** `currentSnap`: 지금 스냅의 위치
	 * - `half`, `full`, `closed`
	 */
	currentSnap: SnapPoint;
	/** `snapTo`: 원하는 위치로 바텀시트를 이동시키는 함수 */
	snapTo: (snap: SnapPoint, animate?: boolean) => void;
	/** `dragHandleProps`: 핸들에 spread할 이벤트 객체 */
	dragHandleProps: {
		/** `onMousedown`: PC에서 마우스 버튼을 클릭하는 순간 발생*/
		onMouseDown: (e: React.MouseEvent) => void;
		/** `onTouchStart`: 모바일에서 손가락으로 핸들을 터치하는 순간 발생 */
		onTouchStart: (e: React.TouchEvent) => void;
	};
}

export function useBottomSheet({
	isOpen,
	onClose,
	halfRatio = DEFAULT_HALF_RATIO,
}: UseBottomSheetOptions): UseBottomSheetReturn {
	const sheetRef = useRef<HTMLDivElement>(null);
	const [currentSnap, setCurrentSnap] = useState<SnapPoint>("half");

	// ref로 관리하는 이유:
	// 드래그 중 매 mousemove마다 setState하면 리렌더링 폭풍이 발생합니다.
	// top은 직접 DOM 조작으로 처리하고, 최종 스냅 상태만 state로 관리합니다.
	const isDragging = useRef(false);
	const startY = useRef(0);
	const startTop = useRef(0);
	const currentTop = useRef(0);
	const lastY = useRef(0);
	const lastTime = useRef(0);
	const velocity = useRef(0);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);
	// backdrop 엘리먼트를 ref로 캐싱
	const backdropRef = useRef<HTMLElement | null>(null);

	/**
	 * `getContainerH`
	 * - 전체 컨테이너 높이를 측정 시점마다 최신값으로 가져오는 함수
	 */
	const getContainerH = useCallback(() => {
		return sheetRef.current?.parentElement?.offsetHeight ?? 0;
	}, []);

	/** `getHalfH`
	 * - 하프 상태일 때 시트가 얼마나 올라와 보여야 하는지 계산하는 함수
	 */
	const getHalfH = useCallback(() => {
		return Math.round(getContainerH() * halfRatio);
	}, [getContainerH, halfRatio]);

	/**
	 * `topForSnap`
	 * - 스냅 위치에서 시트의 `top` 값이 얼마여야 하는지 계산
	 * - top이 작을수록 시트가 높이 올라감 (화면을 더 많이 채움)
	 * - top = 0 → 전체화면, top = containerH - halfH → 하프, top = containerH → 닫힘
	 */
	const topForSnap = useCallback(
		(snap: SnapPoint): number => {
			const containerH = getContainerH();
			if (snap === "closed") return containerH;
			if (snap === "half") return containerH - getHalfH();
			return 0;
		},
		[getContainerH, getHalfH],
	);

	/**
	 * `setSheetTop` : 바텀시트 위치를 `top` 속성으로 변경하는 함수
	 * - DOM을 직접 조작합니다.
	 * - `top` 변경으로 시트의 실제 높이가 함께 변경됩니다. (스크롤 올바르게 동작)
	 * — 드래그 중 리렌더링 없이 60fps 유지
	 */
	const setSheetTop = useCallback(
		(top: number, animate: boolean) => {
			const el = sheetRef.current;
			if (!el) return;

			el.style.transition = animate
				? `top ${SNAP_DURATION_MS}ms ${SNAP_EASING}`
				: "none";
			el.style.top = `${top}px`;

			const backdrop = backdropRef.current;
			if (backdrop) {
				const containerH = getContainerH();
				const pct = 1 - top / containerH;
				backdrop.style.transition = animate
					? `opacity ${SNAP_DURATION_MS}ms ${SNAP_EASING}`
					: "none";
				backdrop.style.opacity = String(Math.min(1, Math.max(0, pct * 1.3)));
			}
		},
		[getContainerH],
	);

	/**
	 *  `snapTo`
	 * - 바텀시트를 특정 스냅의 위치로 이동하도록 모든 함수를 호출하는 함수
	 */
	const snapTo = useCallback(
		(snap: SnapPoint, animate = true) => {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = undefined;

			const top = topForSnap(snap);
			currentTop.current = top;
			setSheetTop(top, animate);
			setCurrentSnap(snap);

			if (snap === "closed") {
				closeTimeoutRef.current = setTimeout(onClose, SNAP_DURATION_MS);
			}
		},
		[topForSnap, setSheetTop, onClose],
	);

	useEffect(() => {
		return () => {
			clearTimeout(closeTimeoutRef.current);
		};
	}, []);

	// isOpen 변화 감지 → 열기 애니메이션
	useEffect(() => {
		if (!isOpen) return;

		const el = sheetRef.current;
		if (!el) return;

		// BottomSheet는 isOpen=true 일 때만 DOM에 존재하므로 열리는 시점에 backdrop을 캐싱
		backdropRef.current =
			el.parentElement?.querySelector<HTMLElement>("[data-backdrop]") ?? null;

		const containerH = getContainerH();

		// 시트를 맨 아래로 즉시 이동 - 사용자 눈에는 시트가 안보이는 상태
		el.style.transition = "none";
		el.style.top = `${containerH}px`;
		currentTop.current = containerH;

		// requestAnimationFrame을 통해 closed에서 half로 변경되는게 잘 보이도록 한다.
		// 다음 프레임에서 올라오는 애니메이션을 렌더링함
		requestAnimationFrame(() => {
			setCurrentSnap("half");
			snapTo("half", true);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// snapTo는 deps에서 의도적으로 제외한다.
		// snapTo는 useCallback으로 관리되며, onClose 등 상위 의존성이 바뀔 때마다 새 참조가 생성된다.
		// deps에 포함하면 isOpen=true 상태에서도 snapTo가 바뀔 때마다 이 effect가 재실행되어
		// 시트가 강제로 half 위치로 되돌아가는 버그가 발생한다.
		// 이 effect는 오직 isOpen이 false→true 로 바뀌는 순간에만 실행되는 '열기 애니메이션' 용이다.
	}, [isOpen]);

	/** `onDragStart` : 드래그를 시작할 때 호출되는 함수 */
	const onDragStart = useCallback((clientY: number) => {
		isDragging.current = true;
		startY.current = clientY;
		startTop.current = currentTop.current;
		lastY.current = clientY;
		lastTime.current = Date.now();
		velocity.current = 0;

		const el = sheetRef.current;
		if (el) el.style.transition = "none";
	}, []);

	/** `onDragMove` : 드래그 중에 호출되는 함수 */
	const onDragMove = useCallback(
		(clientY: number) => {
			if (!isDragging.current) return;

			const now = Date.now();
			const dt = now - lastTime.current;
			if (dt > 0) {
				velocity.current = (clientY - lastY.current) / dt;
			}
			lastY.current = clientY;
			lastTime.current = now;

			const raw = startTop.current + (clientY - startY.current);
			const clamped = Math.max(0, Math.min(getContainerH(), raw));
			currentTop.current = clamped;
			setSheetTop(clamped, false);
		},
		[getContainerH, setSheetTop],
	);

	/**
	 * `onDragEnd`: 드래그가 끝났을 때 호출되는 함수
	 * - 어디로 스냅할지를 결정합니다.
	 */
	const onDragEnd = useCallback(() => {
		if (!isDragging.current) return;
		isDragging.current = false;

		const containerH = getContainerH();
		const halfTop = topForSnap("half");
		const v = velocity.current;
		const top = currentTop.current;

		// 빠른 스와이프: 속도만으로 방향 결정
		if (v > VELOCITY_THRESHOLD) {
			snapTo("closed");
			return;
		}
		if (v < -VELOCITY_THRESHOLD) {
			snapTo("full");
			return;
		}

		// 느린 드래그: 위치 기반으로 가장 가까운 스냅으로
		const midToFull = halfTop * 0.45;
		const midToClose = halfTop + (containerH - halfTop) * 0.4;

		if (top < midToFull) snapTo("full");
		else if (top > midToClose) snapTo("closed");
		else snapTo("half");
	}, [getContainerH, topForSnap, snapTo]);

	// 전역 mousemove / mouseup 등록
	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => onDragMove(e.clientY);
		const onMouseUp = () => {
			if (isDragging.current) onDragEnd();
		};
		const onTouchMove = (e: TouchEvent) => onDragMove(e.touches[0].clientY);
		const onTouchEnd = () => {
			if (isDragging.current) onDragEnd();
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		window.addEventListener("touchmove", onTouchMove, { passive: true });
		window.addEventListener("touchend", onTouchEnd);

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
		};
	}, [onDragMove, onDragEnd]);

	/**
	 * `dragHandleProps`: 바텀 핸들 div에 붙일 이벤트를 묶어둔 객체
	 */
	const dragHandleProps = {
		onMouseDown: (e: React.MouseEvent) => {
			e.preventDefault();
			onDragStart(e.clientY);
		},
		onTouchStart: (e: React.TouchEvent) => {
			onDragStart(e.touches[0].clientY);
		},
	};

	return { sheetRef, currentSnap, snapTo, dragHandleProps };
}
