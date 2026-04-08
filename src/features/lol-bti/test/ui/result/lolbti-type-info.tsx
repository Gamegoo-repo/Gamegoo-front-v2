interface LolBtiTypeInfoProps {
	type: string;
	title: string;
	quote: string;
	size?: "sm" | "lg";
}

export function LolBtiTypeInfo({
	type,
	title,
	quote,
	size = "lg",
}: LolBtiTypeInfoProps) {
	return (
		<div className="flex w-full flex-col items-center">
			<span
				className={
					size === "lg"
						? "bg-gradient-to-br from-[#5A42EE] to-[#7A66FF] bg-clip-text font-black text-[56px] text-transparent"
						: "bg-gradient-to-br from-[#5A42EE] to-[#7A66FF] bg-clip-text font-black text-4xl text-transparent"
				}
			>
				{type}
			</span>
			<span
				className={`font-bold text-white ${size === "lg" ? "mb-7 text-[22px]" : "mb-2 text-base"}`}
			>
				{title}
			</span>
			<span
				className={`font-medium text-[#4ECDC4] ${size === "lg" ? "text-lg" : "text-[15px]"}`}
			>
				"{quote}"
			</span>
		</div>
	);
}
