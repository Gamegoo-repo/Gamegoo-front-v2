import type { ReactNode } from 'react';

export type SnapPoint = 'closed' | 'half' | 'full';

export interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    /**
     * children은 Render Props 패턴.
     * snapTo를 자식에게 노출해서 내부 버튼으로도 스냅 제어 가능.
     */
    children: (actions: { snapTo: (snap: SnapPoint) => void }) => ReactNode;
    /**
     * 하프 사이즈 높이 비율 (0~1, 기본값 0.52)
     */
    halfRatio?: number;
}
