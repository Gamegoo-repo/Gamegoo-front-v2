import { useEffect, useRef, useState } from "react";

// easing 함수를 외부로 분리 (라이브러리들이 이렇게 처리)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

interface UseCountUpOptions {
  duration?: number;
  easing?: (t: number) => number;
  onEnd?: () => void;
}

export default function useCountUp(
  target: number,
  { duration = 2000, easing = easeOutCubic, onEnd }: UseCountUpOptions = {}
) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // 음수 및 유효하지 않은 값 방어
    if (!Number.isFinite(target) || target <= 0) {
      setCount(0);
      return;
    }

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easing(progress);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target); // 정확한 최종값 보장
        onEnd?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // cleanup: 컴포넌트 언마운트 or target 바뀔 때 이전 애니메이션 취소
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, easing, onEnd]);

  return count;
}