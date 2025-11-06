import {
	createContext,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";

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
}

export const PopoverContext = createContext<PopoverContextValue | null>(null);

interface PopoverProviderProps {
	children: ReactNode;
	containerRef?: RefObject<HTMLElement>;
}

export function PopoverProvider({
	children,
	containerRef,
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

	const calculatePosition = () => {
		if (triggerRef.current && contentRef.current) {
			// 트리거 버튼의 위치, 크기 정보
			const triggerRect = triggerRef.current.getBoundingClientRect();

			// 팝오버의 위치, 크기 정보
			const contentRect = contentRef.current.getBoundingClientRect();

			// 컨테이너의 위치, 크기 정보 -> 없다면 window의 경계
			const containerRect = containerRef?.current
				? containerRef.current.getBoundingClientRect()
				: {
						left: 0,
						right: window.innerWidth,
						top: 0,
						bottom: window.innerHeight,
					};
			const gap = 12; // 팝오버와 트리거 사이 간격

			const padding = 16;

			let x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
			let y = triggerRect.bottom + gap;

			let arrowPosition: "top" | "bottom" = "top";

			// left 경계
			if (x < containerRect.left + padding) {
				// 팝오버가 모달 혹은 윈도우의 왼쪽으로 벗어나는 경우
				x = containerRect.left + padding;
			}

			// right 경계
			if (x + contentRect.width > containerRect.right - padding) {
				// 팝오버가 모달 혹은 윈도우의 오른쪽으로 벗어나는 경우
				x = containerRect.right - padding - contentRect.width;
			}

			// bottom 경계
			if (y + contentRect.height > containerRect.bottom - padding) {
				y = triggerRect.top - contentRect.height - gap;
				arrowPosition = "bottom";
			}

			// 팝오버를 기준으로 화살표의 상대 좌표 구하기
			const arrowX = triggerRect.left + triggerRect.width / 2 - x;
			setPosition({ x, y, arrowX, arrowPosition });
		}
		setIsCalculated(true);
	};

	useEffect(() => {
		if (isOpen) {
			// setIsCalculated(false);
			// 팝오버가 열려 있는 경우
			setTimeout(calculatePosition, 0); /** TODO: 이 코드 아직 이해 못함 */
			window.addEventListener("resize", calculatePosition);
			window.addEventListener("scroll", calculatePosition, true);
		}
		return () => {
			window.removeEventListener("resize", calculatePosition);
			window.removeEventListener("scroll", calculatePosition, true);
		};
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
			document.addEventListener("mousedown", handleClickOutside); // 왜 mousedown? click은 이미 다른 이벤트가 처리한 후라 느림
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<PopoverContext.Provider
			value={{
				isCalculated,
				isOpen, // 현재 열림/닫힘 상태
				open, // 열기 함수
				close, // 닫기 함수
				position, // 위치 정보
				triggerRef, // 트리거 ref
				contentRef, // 컨텐츠 ref
			}}
		>
			{children}
		</PopoverContext.Provider>
	);
}

interface PopoverProps {
	children: ReactNode;
	containerRef?: RefObject<HTMLElement>;
}

export function Popover({ children, containerRef }: PopoverProps) {
	return (
		<PopoverProvider containerRef={containerRef}>{children}</PopoverProvider>
	);
}