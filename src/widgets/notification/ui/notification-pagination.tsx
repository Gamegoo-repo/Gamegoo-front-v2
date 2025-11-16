import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { cn } from "@/shared/lib/utils";
import type { NotificationSearch } from "../lib/types";

interface NotificationPaginationProps {
	totalPages: number;
}

export default function NotificationPagination({
	totalPages,
}: NotificationPaginationProps) {
	const navigation = useNavigate();
	const { page = 1, ...rest } = useSearch({
		from: "/_header-layout/mypage/notification",
	}) as NotificationSearch;

	const pageGroupSize = 5;
	const currentGroup = Math.ceil(page / pageGroupSize);
	const startPage = (currentGroup - 1) * pageGroupSize + 1;
	const endPage = Math.min(currentGroup * pageGroupSize, totalPages);
	const visiblePages = Array.from(
		{ length: Math.max(endPage - startPage + 1, 0) },
		(_, i) => startPage + i,
	);

	const go = (next: number) =>
		navigation({
			to: ".",
			search: { ...rest, page: next },
		});

	return (
		<div className="flex w-full items-center justify-center gap-4">
			<button
				type="button"
				onClick={() => page > 1 && go(page - 1)}
				disabled={page === 1}
				className={cn(
					"w-[14px] cursor-pointer text-gray-500",
					page === 1 && "opacity-30 cursor-not-allowed",
				)}
				aria-label="이전 페이지"
			>
				‹
			</button>
			<ol className="flex items-center gap-2">
				{visiblePages.map((p) => {
					const isActive = page === p;
					return (
						<li className="px-[11px] py-[8px]" key={p}>
							<Link
								to="/mypage/notification"
								search={{ ...rest, page: p }}
								className={cn(
									isActive
										? "font-bold text-violet-600"
										: "text-sm font-normal text-gray-500 hover:text-violet-400",
								)}
							>
								{p}
							</Link>
						</li>
					);
				})}
			</ol>
			<button
				type="button"
				onClick={() => page < totalPages && go(page + 1)}
				disabled={page === totalPages}
				className={cn(
					"w-[14px] cursor-pointer text-gray-500",
					page === totalPages && "opacity-30 cursor-not-allowed",
				)}
				aria-label="다음 페이지"
			>
				›
			</button>
		</div>
	);
}
