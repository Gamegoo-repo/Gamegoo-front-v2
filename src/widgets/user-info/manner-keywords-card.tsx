import { getMannerText } from "@/entities/user/lib/get-manner-text";
import type { MannerKeywordResponse } from "@/shared/api";
import { cn } from "@/shared/lib/utils";

type MannerType = "positive" | "negative";

interface MannerKeywordsCardProps {
	title: string;
	keywords: MannerKeywordResponse[];
	type: MannerType;
	expand?: boolean;
}

export default function MannerKeywordsCard({
	title,
	keywords,
	type,
	expand = false,
}: MannerKeywordsCardProps) {
	return (
		<section className={cn("flex h-full flex-col", expand && "flex-1")}>
			<h3 className="mb-2 font-semibold mobile:font-normal mobile:text-2xl text-gray-800 text-lg">
				{title}
			</h3>
			<div
				className={cn(
					"flex-1 mobile:rounded-[20px] rounded-lg bg-gray-800 p-5 mobile:px-6 mobile:py-7",
					expand ? "w-full" : "mobile:w-[221px]",
				)}
			>
				<ul className="flex h-full w-full flex-col justify-between gap-1.5 mobile:gap-4">
					{keywords.map((mannerKeyword) => (
						<li
							key={mannerKeyword.mannerKeywordId}
							className={cn(
								"flex w-full items-center justify-between font-medium mobile:text-base text-sm text-white",
								mannerKeyword.count === 0 && "text-gray-500",
							)}
						>
							{getMannerText(mannerKeyword.mannerKeywordId)}
							<span
								className={cn(
									"font-bold",
									mannerKeyword.count > 0 &&
										type === "positive" &&
										"text-violet-500",
									mannerKeyword.count > 0 &&
										type === "negative" &&
										"text-red-500",
								)}
							>
								{mannerKeyword.count}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
