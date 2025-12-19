import {
	createContext,
	type ReactNode,
	type RefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

type Align = "start" | "center" | "end";

interface PopoverPosition {
	x: number /** 팝오버의 left */;
	y: number /** 팝오버의 top */;
	arrowX: number /** 팝오버를 기준으로 화살표의 가로 위치 */;
	arrowPosition: "top" | "bottom" /**화살표의 위치 */;
}

export interface PopoverContextValue {
	isOpen: boolean;
	open: () => void;
	close: () => void;

	position: PopoverPosition;
	triggerRef: React.RefObject<HTMLElement | null>;
	contentRef: React.RefObject<HTMLDivElement | null>;
	isCalculated: boolean;
	useAbsolute: boolean;
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

interface PopoverProviderProps {
	children: ReactNode;
	containerRef?: RefObject<HTMLElement | null>;
	align?: Align;
}

export function PopoverProvider({
	children,
	containerRef,
	align = "center",
}: PopoverProviderProps) {
	const [isOpen, setIsOpen] = useState(false); // 팝오버 상태
	const [isCalculated, setIsCalculated] = useState(false);
	const [position, setPosition] = useState<PopoverPosition>({
		x: 0,
		y: 0,
		arrowX: 0,
		arrowPosition: "top",
	}); // 위치 상태

	const triggerRef = useRef<HTMLElement>(null); // 트리거 버튼 ref
	const contentRef = useRef<HTMLDivElement>(null); // 팝오버 컨텐츠 ref

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	const resolvedContainerEl = useMemo(() => {
		if (containerRef?.current) return containerRef.current;
		if (triggerRef.current) {
			return triggerRef.current.closest(
				"[data-draggable-container]",
			) as HTMLElement | null as HTMLElement | null;
		}
		return null;
	}, [containerRef?.current, triggerRef.current]);

	const measureAndCompute = () => {
		if (triggerRef.current && contentRef.current) {
			// 트리거 버튼의 위치, 크기 정보
			const triggerRect = triggerRef.current.getBoundingClientRect();

			// 팝오버의 위치, 크기 정보
			const contentRect = contentRef.current.getBoundingClientRect();

			const gap = 12; // 팝오버와 트리거 사이 간격

			const padding = 16;

			// 실제 absolute 기준이 되는 요소를 정확히 탐지 (offsetParent)
			// - 가장 가까운 position이 지정된 조상 요소
			// - 없으면 null (viewport 기준)
			let baseRect: DOMRect | null = null;
			const offsetParent = contentRef.current
				? (contentRef.current.offsetParent as HTMLElement | null)
				: null;
			if (offsetParent) {
				baseRect = offsetParent.getBoundingClientRect();
			} else if (resolvedContainerEl) {
				// fallback: 지정된 컨테이너 (드래그 다이얼로그 등)
				baseRect = resolvedContainerEl.getBoundingClientRect();
			}

			// 기본: viewport 기준 좌표
			let x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
			// 수평 정렬 전략
			if (align === "start") {
				x = triggerRect.left;
			} else if (align === "end") {
				x = triggerRect.right - contentRect.width;
			}
			let y = triggerRect.bottom + gap;

			// 실제 기준 요소가 있다면 그 좌표계로 변환
			if (baseRect) {
				x -= baseRect.left;
				y -= baseRect.top;
			}

			const arrowPosition: "top" | "bottom" = "top";

			// 경계 처리: 기준 폭은 컨테이너 또는 뷰포트
			const boundaryWidth = baseRect
				? baseRect.right - baseRect.left
				: window.innerWidth;
			if (x < padding) x = padding;
			if (x + contentRect.width > boundaryWidth - padding) {
				x = boundaryWidth - padding - contentRect.width;
			}

			// // bottom 경계
			// if (y + contentRect.height > containerRect.bottom - padding) {
			// 	y = triggerRect.top - contentRect.height - gap;
			// 	arrowPosition = "bottom";
			// }

			// 팝오버를 기준으로 화살표의 상대 좌표 구하기
			let triggerCenterX = triggerRect.left + triggerRect.width / 2;
			if (baseRect) triggerCenterX -= baseRect.left;
			const arrowX = triggerCenterX - x;
			return { x, y, arrowX, arrowPosition };
		} else {
			// 요소가 아직 준비되지 않은 최초 렌더 타이밍 보호
			return null;
		}
	};

	const calculatePosition = () => {
		const pos = measureAndCompute();
		if (pos) {
			setPosition(pos);
			setIsCalculated(true);
		} else {
			requestAnimationFrame(calculatePosition);
		}
	};

	useEffect(() => {
		if (isOpen) {
			// 초기 깜빡임 방지: 계산이 끝날 때까지 숨김
			setIsCalculated(false);
			// 팝오버가 열려 있는 경우
			// 안정화 루프: 위치가 프레임 간 크게 변하지 않을 때까지 계산 (최대 5회)
			let attempt = 0;
			let lastPos: { x: number; y: number } | null = null;
			const threshold = 0.5; // px
			const stabilize = () => {
				const pos = measureAndCompute();
				if (!pos) {
					requestAnimationFrame(stabilize);
					return;
				}
				if (
					lastPos &&
					Math.abs(pos.x - lastPos.x) < threshold &&
					Math.abs(pos.y - lastPos.y) < threshold
				) {
					setPosition(pos);
					setIsCalculated(true);
					return;
				}
				lastPos = { x: pos.x, y: pos.y };
				attempt += 1;
				if (attempt >= 5) {
					setPosition(pos);
					setIsCalculated(true);
					return;
				}
				requestAnimationFrame(stabilize);
			};
			requestAnimationFrame(stabilize);
			window.addEventListener("resize", calculatePosition);
			window.addEventListener("scroll", calculatePosition, true);

			// 컨테이너 이동/크기 변화(스타일 변경)
			let observer: MutationObserver | null = null;
			if (resolvedContainerEl) {
				observer = new MutationObserver(() => {
					calculatePosition();
				});
				observer.observe(resolvedContainerEl, {
					attributes: true,
					attributeFilter: ["style"],
				});
			}
			let triggerObserver: MutationObserver | null = null;
			if (triggerRef.current) {
				triggerObserver = new MutationObserver(() => {
					calculatePosition();
				});
				triggerObserver.observe(triggerRef.current, {
					attributes: true,
					subtree: false,
				});
			}
			// 컨텐츠 사이즈 변경(메뉴 항목 수 변화 등) 감지
			let contentObserver: MutationObserver | null = null;
			if (contentRef.current) {
				contentObserver = new MutationObserver(() => {
					calculatePosition();
				});
				contentObserver.observe(contentRef.current, {
					attributes: true,
					childList: true,
					subtree: true,
				});
			}

			return () => {
				if (observer) observer.disconnect();
				if (triggerObserver) triggerObserver.disconnect();
				if (contentObserver) contentObserver.disconnect();
				window.removeEventListener("resize", calculatePosition);
				window.removeEventListener("scroll", calculatePosition, true);
			};
		}
		return;
	}, [isOpen]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				contentRef.current &&
				!contentRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				close();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<PopoverContext.Provider
			value={{
				isCalculated,
				isOpen,
				open,
				close,
				position,
				triggerRef,
				contentRef,
				useAbsolute: !!resolvedContainerEl,
			}}
		>
			{children}
		</PopoverContext.Provider>
	);
}

interface PopoverProps {
	children: ReactNode;
	containerRef?: RefObject<HTMLElement | null>;
	align?: Align;
}

export function Popover({
	children,
	containerRef,
	align = "center",
}: PopoverProps) {
	return (
		<PopoverProvider containerRef={containerRef} align={align}>
			{children}
		</PopoverProvider>
	);
}
