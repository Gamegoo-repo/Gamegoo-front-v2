import { Link } from "@tanstack/react-router";
import { getWinRateColors } from "@/entities/game/lib/getWinRateColor";
import { MOCK_USER_PROFILE } from "@/entities/user/config/user-mock-data";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { FlexBox } from "@/shared/ui/flexbox";

export default function LolBtiTestCtaCard() {
	return (
		<div className="flex w-full flex-col items-center rounded-[20px] bg-gray-900 p-4 pt-14 shadow-[0px_4px_20px_0_rgba(0,0,0,0.25)]">
			<h3 className="mb-12 font-[900] text-4xl text-white">내 롤BTI는?</h3>
			<FlexBox direction="column" align="center" className="w-full blur-sm">
				<img
					alt="롤BTI 예시 이미지"
					className="mb-3 size-[132px]"
					src="/assets/images/results/1.png"
				/>
				<span className="mb-7 inline-block text-center font-bold text-white text-xl">
					겜구겜구
				</span>
				<FlexBox
					direction="row"
					align="center"
					justify="center"
					gap="md"
					className="mb-4 w-full rounded-[10px] bg-gray-800 px-4 py-2"
				>
					{MOCK_USER_PROFILE.championStatsResponseList.map(
						(champion, _index) => (
							<div
								key={champion.championId}
								className="flex flex-col items-center justify-center"
							>
								<img
									src={`/champion/${champion.championId}.png`}
									alt={champion.championName}
									className={cn("size-11 shrink-0 rounded-full")}
								/>
								<span
									className={cn(
										"-mt-1 rounded-full px-1 text-center font-bold text-[11px] text-white leading-none",
										getWinRateColors(champion.winRate).bg,
									)}
								>
									{Math.round(champion.winRate)}%
								</span>
							</div>
						),
					)}
				</FlexBox>
			</FlexBox>
			<Button asChild className="w-full rounded-xl py-5 text-sm">
				<Link to="/lolbti/test">내 롤BTI 검사하기👉</Link>
			</Button>
		</div>
	);
}
