import type { ReactNode, RefObject } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import PopoverHeader from "@/shared/ui/popover/popover-header";
import type { MannerKeywordListResponse } from "@/shared/api";
import { getMannerText } from "../lib/get-manner-text";
import { cn } from "@/shared/lib/utils";

export default function MannerLevelPopover({
	children,
	containerRef,
	userMannerInfo,
}: {
	children: ReactNode;
	containerRef: React.RefObject<HTMLDivElement | null>;
	userMannerInfo: MannerKeywordListResponse;
}) {
	const level = 5;
	return (
		<Popover containerRef={containerRef as RefObject<HTMLElement>}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-[472px]">
				<div className="w-full flex flex-col gap-7">
					<PopoverHeader title={`매너 레벨 LV. ${level}`} />
					<div className="w-full flex gap-14">
						<section className="w-1/2 flex flex-col gap-4">
							<span className="block semibold-13 text-white">
								받은 매너평가
							</span>
							<ul className="w-full flex flex-col gap-4">
								{userMannerInfo.mannerKeywords
									.slice(0, 6)
									.map((mannerKeyword) => (
										<li
											key={mannerKeyword.mannerKeywordId}
											className={cn(
												"w-full flex items-center justify-between bold-16 text-gray-500",
												mannerKeyword.count > 0 && "text-violet-400",
											)}
										>
											{getMannerText(mannerKeyword.mannerKeywordId)}
											<span>{mannerKeyword.count}</span>
										</li>
									))}
							</ul>
						</section>
						<section className="w-1/2 flex flex-col gap-4">
							<span className="block semibold-13 text-white">
								받은 비매너평가
							</span>
							<ul className="w-full flex flex-col gap-4">
								{userMannerInfo.mannerKeywords.slice(6).map((mannerKeyword) => (
									<li
										key={mannerKeyword.mannerKeywordId}
										className={cn(
											"w-full flex items-center justify-between bold-16 text-gray-500",
											mannerKeyword.count > 0 && "text-red-400",
										)}
									>
										{getMannerText(mannerKeyword.mannerKeywordId)}
										<span>{mannerKeyword.count}</span>
									</li>
								))}
							</ul>
						</section>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
