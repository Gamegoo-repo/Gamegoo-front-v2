import { useSearch } from "@tanstack/react-router";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/entities/auth";
import { useFetchPostsWithCursorQuery } from "@/entities/post/model/use-mobile-post-list";
import PostCard from "@/entities/post/ui/post-card";
import PostCardSkeletons from "@/entities/post/ui/post-card-skeleton";
import PostActionMenu from "@/features/board/ui/post-action-menu";

export const PostList = () => {
	const search = useSearch({ from: "/_header-layout/board/" });
	const { mode, tier, mike, position } = search;

	const { isAuthenticated, user } = useAuth();

	const {
		pages,
		isLoading,
		isError,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useFetchPostsWithCursorQuery({
		isAuthenticated,
		gameMode: mode,
		tier: tier,
		mainP: position,
		subP: undefined,
		mike: mike,
	});

	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (!pages || isLoading) {
		return (
			<div className="flex w-full flex-col gap-4 px-5 pt-4">
				<PostCardSkeletons />
			</div>
		);
	}

	if (isError) {
		return null;
	}

	const isEmpty = pages && pages[0]?.boards.length === 0;

	if (isEmpty) {
		return (
			<div className="flex w-full items-center justify-center px-5 py-28">
				<p className="text-gray-700 text-sm">게시된 글이 없습니다.</p>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-4 px-5 pt-4">
			<ul className="flex flex-col gap-4">
				{pages.map((page) => {
					return (
						<Fragment key={page?.cursorId}>
							{page?.boards.map((post) => (
								<li key={post.boardId}>
									<PostCard
										{...post}
										kebabMenu={
											isAuthenticated && user ? (
												<PostActionMenu
													postOwnerId={post.memberId}
													currentUserId={user.id}
													postId={post.boardId}
													isBlocked={post.isBlocked ?? false}
												/>
											) : undefined
										}
									/>
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
};
