import type { SnapPoint } from './types';

export const SNAP: Record<string, SnapPoint> = {
    CLOSED: 'closed',
    HALF: 'half',
    FULL: 'full',
} as const;

export const DEFAULT_HALF_RATIO = 0.52;

// 이 이상 속도면 snap 방향 강제 결정
export const VELOCITY_THRESHOLD = 0.6;

// 스냅 애니메이션 커브 — iOS 바텀시트에서 따옴
export const SNAP_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';
export const SNAP_DURATION_MS = 340;
