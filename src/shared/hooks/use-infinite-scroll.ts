import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	fetchNextPage: () => void;
	threshold?: number;
}

export const useInfiniteScroll = ({
	hasNextPage,
	isFetchingNextPage,
	fetchNextPage,
	threshold = 50,
}: UseInfiniteScrollOptions) => {
	const sentinelRef = useRef<HTMLDivElement>(null);
	const hasNextPageRef = useRef(hasNextPage);
	const isFetchingNextPageRef = useRef(isFetchingNextPage);
	const fetchNextPageRef = useRef(fetchNextPage);

	hasNextPageRef.current = hasNextPage;
	isFetchingNextPageRef.current = isFetchingNextPage;
	fetchNextPageRef.current = fetchNextPage;

	const handleIntersection = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;

			if (
				entry.isIntersecting &&
				hasNextPageRef.current &&
				!isFetchingNextPageRef.current
			) {
				fetchNextPageRef.current();
			}
		},
		[],
	);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: `${threshold}px`,
			threshold: 0.1,
		});

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [handleIntersection, threshold]);

	useEffect(() => {
		if (hasNextPage) {
			const timeoutId = setTimeout(() => {
				const sentinel = sentinelRef.current;
				if (sentinel) {
					const observer = new IntersectionObserver(handleIntersection, {
						root: null,
						rootMargin: `${threshold}px`,
						threshold: 0.1,
					});

					observer.observe(sentinel);
				}
			}, 50);

			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [hasNextPage, handleIntersection, threshold]);

	return { sentinelRef };
};
