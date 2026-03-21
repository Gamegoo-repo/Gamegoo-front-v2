import { Link } from "@tanstack/react-router";
import { LogoImg } from "@/shared/assets/lolbti";
import { FlexBox } from "@/shared/ui/flexbox";
import { LogoButton } from "@/shared/ui/logo";
import useFetchParticipants from "../../model/use-fetch-participants";
import { LolBtiLayout } from "../lolbti-layout";
import CountUp from "./count-up";

interface LolBtiQuizSectionProps {
	onStart: () => void;
}

export default function LolBtiLandingSection({
	onStart,
}: LolBtiQuizSectionProps) {
	const { data, isPending } = useFetchParticipants();

	return (
		<LolBtiLayout>
			<FlexBox direction="column" align="center" className="w-full flex-1 p-7">
				<header className="mt-5 flex w-full items-center justify-center">
					<LogoButton className="w-[120px] text-violet-600" />
				</header>
				<FlexBox direction="column" align="center" asChild>
					<section className="mt-7">
						<img src={LogoImg} className="w-[40%]" alt="롤BTI" />
						<p className="mt-4 text-[#CCC] text-[19px]">
							나의 롤 플레이 스타일을 알아보자!
						</p>
						<FlexBox
							align="center"
							justify="center"
							className="emoji-container mt-12 gap-[30px] text-5xl"
						>
							<span className="emoji">🎮</span>
							<span className="emoji">⚔️</span>
							<span className="emoji">🏆</span>
						</FlexBox>
						{/* <p className="mt-[52px] inline-block rounded-full border border-white/20 bg-white/10 px-6 py-2 text-[#9A9A9A] text-[15px]">
							지금까지 <span className="font-bold text-white">{count}</span>
							명이 참여했어요
						</p> */}
						{
							<p className="mt-[52px] inline-block rounded-full border border-white/20 bg-white/10 px-6 py-2 text-[#9A9A9A] text-[15px]">
								지금까지{" "}
								<span className="font-bold text-white">
									{data ? <CountUp end={data.totalParticipants + 7555} /> : 0}
								</span>
								명이 참여했어요
							</p>
						}

						<FlexBox
							direction="column"
							justify="center"
							align="center"
							className="mt-8 w-full gap-5"
						>
							<button
								type="button"
								className="hover:-translate-y-0.5 w-[80%] max-w-[280px] cursor-pointer rounded-lg bg-[linear-gradient(80deg,var(--color-blue-60,#5A42EE)_0%,var(--color-blue-70,#7A66FF)_100%)] px-6 py-[14px] font-bold text-base text-white leading-normal transition-all duration-300 hover:shadow-[0_0_40px_rgba(90,66,238,0.5)]"
								onClick={onStart}
							>
								시작하기
							</button>

							<button
								type="button"
								className="cursor-pointer rounded-lg font-bold text-[#BFBFBF] text-base leading-normal transition-all duration-300 hover:underline hover:underline-offset-4"
							>
								공유하기
							</button>
						</FlexBox>
						{/* <Link
						to="/board"
						className="mt-[26px] cursor-pointer font-bold text-[#BFBFBF] text-base hover:underline"
					>
						겜구 바로가기
					</Link> */}
						<hr className="my-[46px] w-full border border-[#3A3A4A]" />
						<article className="text-center text-[#9A9A9A] text-[15px]">
							<span className="mb-[7px] inline-block text-[#BFBFBF]">
								<b className="font-bold">겜구</b>(gamegoo)란?
							</span>
							<br />
							게임 친구 구함의 줄임말로,
							<br />
							리그오브레전드 유저를 위한 실시간 매칭 플랫폼
							<br /> 이에요.
						</article>
					</section>
				</FlexBox>
			</FlexBox>
			<Link
				to="/"
				className="flex h-[60px] w-full items-center justify-center bg-[#7560FC] font-bold text-base text-white"
			>
				겜구에서 친구 찾기👉
			</Link>
		</LolBtiLayout>
	);
}
