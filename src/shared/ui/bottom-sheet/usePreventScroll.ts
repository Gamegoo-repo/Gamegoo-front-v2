import { useEffect } from 'react';

/**
 * isOpen이 true인 동안 body 스크롤을 잠급니다.
 * 모바일에서 바텀시트 뒤 페이지가 같이 스크롤되는 현상 방지.
 */
export function usePreventScroll(isOpen: boolean) {
    useEffect(() => {
        if (!isOpen) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);
}
