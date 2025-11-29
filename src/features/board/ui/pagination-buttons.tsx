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
		<div className="flex w-full items-center justify-center gap-4">
			{/* 이전 페이지 */}
			<button
				type="button"
				onClick={handleClickPrevPage}
				disabled={currentPage === 1}
				className={cn(
					"w-[14px] cursor-pointer",
					currentPage === 1 && "cursor-not-allowed opacity-30",
				)}
			>
				<ArrowLeftIcon />
			</button>

			{/* 페이지 번호들 */}
			<ol className="flex items-center gap-2">
				{visiblePages.map((pageNumber) => {
					const isActive = currentPage === pageNumber;

					return (
						<li className="px-[11px] py-[8px]" key={pageNumber}>
							<Link
								to="/board"
								search={{ ...search, page: pageNumber }}
								className={cn(
									isActive
										? "font-bold text-violet-600"
										: "font-normal text-gray-500 text-sm hover:text-violet-400",
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
					"w-[14px] cursor-pointer",
					currentPage === totalPages && "cursor-not-allowed opacity-30",
				)}
			>
				<ArrowRightIcon />
			</button>
		</div>
	);
}
