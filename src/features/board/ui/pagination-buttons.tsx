import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { cn } from "@/shared/lib/utils";
import ArrowLeftIcon from "./assets/arrow-left.svg?react";
import ArrowRightIcon from "./assets/arrow-right.svg?react";

interface PaginationButtonsProps {
	totalPages: number;
	pageGroupSize?: number; // 한 번에 보여줄 페이지 버튼 개수
}

export default function PaginationButtons({
	totalPages,
	pageGroupSize = 10,
}: PaginationButtonsProps) {
	const navigation = useNavigate();

	const { page: currentPage = 1, ...search } = useSearch({
		from: "/_header-layout/board/",
	});

	const currentGroup = Math.ceil(currentPage / pageGroupSize);
	const startPage = (currentGroup - 1) * pageGroupSize + 1;
	const endPage = Math.min(currentGroup * pageGroupSize, totalPages);

	const visiblePages = Array.from(
		{ length: endPage - startPage + 1 },
		(_, i) => startPage + i,
	);

	const handleClickPrevPage = () => {
		if (currentPage > 1) {
			navigation({ to: ".", search: { ...search, page: currentPage - 1 } });
		}
	};

	const handleClickNextPage = () => {
		if (currentPage < totalPages) {
			navigation({ to: ".", search: { ...search, page: currentPage + 1 } });
		}
	};

	return (
		<div className="flex gap-4 items-center w-full justify-center">
			{/* 이전 페이지 */}
			<button
				type="button"
				onClick={handleClickPrevPage}
				disabled={currentPage === 1}
				className={cn(
					"cursor-pointer w-[14px]",
					currentPage === 1 && "opacity-30 cursor-not-allowed",
				)}
			>
				<ArrowLeftIcon />
			</button>

			{/* 페이지 번호들 */}
			<ol className="flex gap-2 items-center">
				{visiblePages.map((pageNumber) => {
					const isActive = currentPage === pageNumber;

					return (
						<li className="px-[11px] py-[8px]" key={pageNumber}>
							<Link
								to="/board"
								search={{ ...search, page: pageNumber }}
								className={cn(
									isActive
										? "text-violet-600 font-bold"
										: "text-sm text-gray-500 font-normal hover:text-violet-400",
								)}
							>
								{pageNumber}
							</Link>
						</li>
					);
				})}
			</ol>

			{/* 다음 페이지 */}
			<button
				type="button"
				onClick={handleClickNextPage}
				disabled={currentPage === totalPages}
				className={cn(
					"cursor-pointer w-[14px]",
					currentPage === totalPages && "opacity-30 cursor-not-allowed",
				)}
			>
				<ArrowRightIcon />
			</button>
		</div>
	);
}
