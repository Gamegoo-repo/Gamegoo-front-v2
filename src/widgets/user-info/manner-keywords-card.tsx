import { getMannerText } from "@/entities/user/lib/get-manner-text";
import type {
	MannerKeywordListResponse,
	MannerKeywordResponse,
	MannerResponse,
} from "@/shared/api";
import { cn } from "@/shared/lib/utils";

type MannerType = "positive" | "negative";

interface MannerKeywordsCardProps {
	title: string;
	keywords: MannerKeywordResponse[];
	type: MannerType;
}

export default function MannerKeywordsCard({
	title,
	keywords,
	type,
}: MannerKeywordsCardProps) {
	return (
		<section>
			<h3 className="text-gray-800 regular-25 mb-2">{title}</h3>
			<div className="bg-gray-800 rounded-[20px] h-[264px] w-[221px] px-6 py-7">
				<ul className="w-full h-full flex flex-col justify-between">
					{keywords.map((mannerKeyword) => (
						<li
							key={mannerKeyword.mannerKeywordId}
							className={cn(
								"w-full flex items-center justify-between medium-16 text-white",
								mannerKeyword.count === 0 && "text-gray-500",
							)}
						>
							{getMannerText(mannerKeyword.mannerKeywordId)}
							<span
								className={cn(
									"bold-16",
									mannerKeyword,
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
