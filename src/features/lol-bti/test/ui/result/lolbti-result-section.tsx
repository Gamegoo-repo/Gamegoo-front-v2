import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	LOL_BTI_COMPATIBILITY_MAP,
	LOL_BTI_TYPE_DATA,
	LOL_POSITION_LABEL,
	type LolBtiAxisKey,
	type LolBtiResultType,
	type LolPosition,
} from "@/features/lol-bti/test/config";
import { getEventSource } from "@/shared/lib/get-device";
import { SessionManager } from "@/shared/lib/session/session-manager";
import { FlexBox } from "@/shared/ui/flexbox";
import { trackRollBtiEvent } from "../../api";
import { LolBtiLayout } from "../lolbti-layout";
import { LolBtiAxisResult } from "./lolbti-axis-result";
import LolBtiCompatibleCard, {
	LolBtiIncompatibleCard,
} from "./lolbti-compatible-card";
import { LolBtiPositionCard } from "./lolbti-position-card";
import { LolBtiProfileCard } from "./lolbti-profile-card";
import LolBtiStrengthWeakness from "./lolbti-strength-weakness";
import { copyTextToClipboard } from "@/shared/lib/copy-riot-id";
import { toast } from "@/shared/lib/toast";

export default function LolBtiResultSection({
	title = "나의 롤BTI는?",
	lolBti,
	resultId,
	axisPercentages,
	footer,
}: {
	/** 결과 화면 상단 헤딩. 기본값: "나의 롤BTI는?" */
	title?: string;
	lolBti: LolBtiResultType;
	resultId: string | null;
	axisPercentages: Record<LolBtiAxisKey, number>;
	/** sticky 하단 CTA 영역의 내용. 접근 경로에 따라 다른 버튼을 주입한다 */
	footer: ReactNode;
}) {
	const navigate = useNavigate();
	const typeData = LOL_BTI_TYPE_DATA[lolBti];
	const compatibility = LOL_BTI_COMPATIBILITY_MAP[lolBti];
	const positionEntries = Object.entries(typeData.positions) as [
		LolPosition,
		{ name: string; championId: number }[],
	][];

	const handleGoToGamegoo = (url: string = "/") => {
		trackRollBtiEvent({
			eventType: "GO_TO_GAMEGOO",
			eventSource: getEventSource(),
			sessionId: SessionManager.getOrCreateId(),
		});
		navigate({ to: url });
	};

	return (
		<LolBtiLayout variant="result">
			<FlexBox
				direction="column"
				align="center"
				className="relative w-full p-7"
			>
				<FlexBox direction="column" align="center" gap="md" className="w-full">
					<h1 className="font-bold text-[26px] text-white">{title}</h1>

					<section className="flex w-full animate-appear flex-col gap-10 self-stretch rounded-[25px] border-2 border-[rgba(90,66,238,0.35)] bg-white/5 px-4 py-6 shadow-[0_0_40px_0_rgba(90,66,238,0.25)] backdrop-blur-[5px]">
						<LolBtiProfileCard
							type={lolBti}
							title={typeData.title}
							quote={typeData.quote}
							description={typeData.description}
							imageIndex={typeData.imageIndex}
						/>
						<LolBtiStrengthWeakness
							strength={typeData.strengths}
							weakness={typeData.weaknesses}
						/>
						<button
							onClick={() => {
								if (resultId?.length) {
									copyTextToClipboard(
										`https://www.gamegoo.co.kr/lolbti/results/${resultId}`,
									);
								} else {
									toast.error(
										"공유 링크 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
									);
								}
							}}
							type="button"
							className="w-full cursor-pointer rounded-lg bg-linear-to-r from-violet-600 to-violet-500 py-4 font-bold text-base text-white transition-all duration-300 hover:text-gray-300 active:scale-95"
						>
							결과 공유하기
						</button>

						<section className="flex w-full flex-col items-center gap-12 rounded-2xl border-2 border-[#333] bg-[#1A1A1A] pt-8 pb-11">
							<div className="flex w-full flex-col items-center gap-4 px-[34px]">
								<h3 className="font-semibold text-white text-xl">
									👍 잘 맞는 유형
								</h3>
								{compatibility.good.map((type) => {
									const goodData = LOL_BTI_TYPE_DATA[type];
									return (
										<LolBtiCompatibleCard
											key={type}
											type={type}
											title={goodData.title}
											quote={goodData.quote}
										/>
									);
								})}
							</div>

							<div className="flex w-full flex-col items-center gap-4 px-[34px]">
								<h3 className="font-semibold text-white text-xl">
									👎 안 맞는 유형
								</h3>
								{compatibility.bad.map((type) => {
									const badData = LOL_BTI_TYPE_DATA[type];
									return (
										<LolBtiIncompatibleCard
											key={type}
											type={type}
											title={badData.title}
											quote={badData.quote}
										/>
									);
								})}
							</div>
						</section>
						<section className="flex w-full flex-col items-center gap-10 rounded-2xl border-2 border-[#333] bg-[#1A1A1A] px-8 py-10 pb-[72px]">
							<h3 className="text-center font-bold text-white text-xl [text-shadow:0_0_10px_rgba(90,66,238,0.40)]">
								내 성향 분석
							</h3>
							<LolBtiAxisResult
								axisKey="A/F"
								percentage={axisPercentages["A/F"]}
							/>
							<LolBtiAxisResult
								axisKey="D/S"
								percentage={axisPercentages["D/S"]}
							/>
							<LolBtiAxisResult
								axisKey="C/T"
								percentage={axisPercentages["C/T"]}
							/>
							<LolBtiAxisResult
								axisKey="I/B"
								percentage={axisPercentages["I/B"]}
							/>
						</section>
					</section>
				</FlexBox>
				<FlexBox
					id={"result-card"}
					direction="column"
					align="center"
					className="mt-10 w-full gap-7 rounded-[15px] border-1 border-white/10 bg-white/5 px-6 pt-11 pb-6"
				>
					<h3 className="text-center font-bold text-white text-xl">
						추천 챔피언
					</h3>

					<FlexBox direction={"column"} className="w-full gap-4">
						{positionEntries.map(([position, champions]) => (
							<LolBtiPositionCard
								key={position}
								position={LOL_POSITION_LABEL[position]}
								champions={champions}
							/>
						))}
					</FlexBox>
				</FlexBox>

				<FlexBox
					direction="column"
					align="center"
					className="mt-10 w-full px-6"
					gap={"lg"}
				>
					<span
						className={[
							"relative inline-block self-center text-center",
							"font-semibold text-[#bfbfbf] text-sm",
							"rounded-md bg-[#2a2a2a] px-2.5 py-1.5",
							"shadow-[0_8px_24px_rgba(0,0,0,0.2)]",
							"mt-3 animate-bubble-float",
							"before:-translate-x-1/2 before:absolute before:left-1/2 before:content-['']",
							"before:-bottom-2 before:h-2 before:w-3 before:bg-[#2a2a2a]",
							"before:[clip-path:polygon(0_0,100%_0,50%_100%)]",
						].join(" ")}
					>
						<span className="text-[#00e6ff]">나와 잘맞는 친구</span>를
						찾고싶다면?
					</span>
					<button
						type="button"
						onClick={() => handleGoToGamegoo()}
						className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-white py-4 font-bold text-violet-600 transition-all duration-300 hover:underline active:scale-95"
					>
						겜구 바로가기
					</button>
				</FlexBox>

				<article className="pt-14 pb-20 text-center text-[#9A9A9A] text-[15px]">
					<span className="mb-[7px] inline-block text-[#BFBFBF]">
						<b className="font-bold">겜구</b>(gamegoo)란?
					</span>
					<br />
					게임 친구 구함의 줄임말로,
					<br />
					리그오브레전드 유저를 위한 실시간 매칭 플랫폼
					<br /> 이에요.
				</article>
			</FlexBox>

			<div className="sticky right-0 bottom-0 left-0 flex mobile:w-[440px] w-full flex-col items-center gap-5 bg-[linear-gradient(180deg,rgba(23,22,28,0.00)_0%,#17161C_58.93%)] px-[50px] pt-[31px] pb-12">
				{footer}
			</div>
		</LolBtiLayout>
	);
}
