import type { ReactNode, RefObject } from "react";
import type { MannerKeywordListResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import PopoverHeader from "@/shared/ui/popover/popover-header";
import { getMannerText } from "../lib/get-manner-text";

export default function MannerLevelPopover({
	children,
	containerRef,
	userMannerInfo,
	userMannerLevel,
}: {
	children: ReactNode;
	containerRef: React.RefObject<HTMLDivElement | null>;
	userMannerInfo: MannerKeywordListResponse;
	userMannerLevel: number;
}) {
	return (
		<Popover containerRef={containerRef as RefObject<HTMLElement>}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>

			<PopoverContent
				className="
          popover
          w-[calc(100vw-32px)]
          mobile:w-[472px]
          p-4
          mobile:p-8
        "
			>
				<div className="flex w-full flex-col gap-4 mobile:gap-7">
					<PopoverHeader title={`매너 레벨 LV. ${userMannerLevel}`} />

					{/* 🔽 컬럼 영역 */}
					<div className="flex w-full flex-col gap-6 mobile:flex-row mobile:gap-14">
						{/* 매너 평가 */}
						<section className="flex w-full mobile:w-1/2 flex-col gap-3 mobile:gap-4">
							<span className="semibold-13 block text-white">
								받은 매너평가
							</span>
							<ul className="flex w-full flex-col gap-2 mobile:gap-4">
								{userMannerInfo.mannerKeywords
									.slice(0, 6)
									.map((mannerKeyword) => (
										<li
											key={mannerKeyword.mannerKeywordId}
											className={cn(
												`
                        flex w-full items-center justify-between
                        bold-16 mobile:bold-16
                        text-sm mobile:text-base
                        text-gray-500
                      `,
												mannerKeyword.count > 0 && "text-violet-400",
											)}
										>
											{getMannerText(mannerKeyword.mannerKeywordId)}
											<span>{mannerKeyword.count}</span>
										</li>
									))}
							</ul>
						</section>

						{/* 비매너 평가 */}
						<section className="flex w-full mobile:w-1/2 flex-col gap-3 mobile:gap-4">
							<span className="semibold-13 block text-white">
								받은 비매너평가
							</span>
							<ul className="flex w-full flex-col gap-2 mobile:gap-4">
								{userMannerInfo.mannerKeywords.slice(6).map((mannerKeyword) => (
									<li
										key={mannerKeyword.mannerKeywordId}
										className={cn(
											`
                        flex w-full items-center justify-between
                        bold-16 mobile:bold-16
                        text-sm mobile:text-base
                        text-gray-500
                      `,
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
