interface LolBtiProfileCardProps {
	type: string; // "ADCI"
	title: string; // "단독 캐리형"
	quote: string; // "내가 캐리하면 다 끝."
	description: string; // "공격적인 교전으로..."
	imageIndex: number; // 1
}

export function LolBtiProfileCard({
	type,
	title,
	quote,
	description,
	imageIndex,
}: LolBtiProfileCardProps) {
	return (
		// biome-ignore lint/correctness/useUniqueElementIds: <explanation>
		<article id="result-card" className="flex w-full flex-col items-center">
			<span className="mb-0 bg-gradient-to-br from-[#5A42EE] to-[#7A66FF] bg-clip-text font-black text-[56px] text-transparent [text-shadow:0_0_30px_rgba(90,66,238,0.5)]">
				{type}
			</span>
			<span className="mb-7 font-bold text-[22px] text-white">{title}</span>
			<span className="mb-9 font-medium text-[#4ECDC4] text-lg">"{quote}"</span>
			<img
				alt={`${type} ${title} 결과 이미지`}
				src={`/assets/images/results/${imageIndex}.png`}
				className="mb-7 size-[90%] rounded-xl object-cover"
			/>
			<p className="w-full break-keep text-center text-[#CCC] text-lg">
				{description}
			</p>
		</article>
	);
}
