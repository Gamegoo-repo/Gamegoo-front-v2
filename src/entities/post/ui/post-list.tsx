import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useBoardFilterStore } from "@/features/board/model/board-filter-store";
import { useFetchPostsWithCursorQuery } from "../model/use-mobile-post-list";
import PostCard from "./post-card";
import PostCardSkeletons from "./post-card-skeleton";

export default function PostList() {
	const { gameMode, tier, position, mike } = useBoardFilterStore();

	const {
		pages,
		isLoading,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useFetchPostsWithCursorQuery({
		gameMode: gameMode,
		tier: tier,
		mainP: position,
		subP: undefined,
		mike: mike,
	});

	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	if (!pages || isLoading) {
		return (
			<div className="flex w-full flex-col gap-4 px-5 pt-4">
				<PostCardSkeletons />
			</div>
		);
	}

	if (isError) {
		return <></>;
	}

	return (
		<div className="flex w-full flex-col gap-4 px-5 pt-4">
			<ul className="flex flex-col gap-4">
				{pages.map((page) => {
					return (
						<Fragment key={page?.cursorId}>
							{page?.boards.map((post) => (
								<li key={post.boardId}>
									<PostCard {...post} />
								</li>
							))}
						</Fragment>
					);
				})}
			</ul>
			{pages && !isFetchingNextPage && hasNextPage && <div ref={ref} />}

			{isFetchingNextPage && <PostCardSkeletons />}
		</div>
	);
}
