import { createFileRoute, Link } from "@tanstack/react-router";
import Book from "@/shared/assets/characters/book.svg?react";
import Character4Icon from "@/shared/assets/characters/character4.svg?react";
import Character6Icon from "@/shared/assets/characters/character6.svg?react";
import Character7Icon from "@/shared/assets/characters/character7.svg?react";
import Character8Icon from "@/shared/assets/characters/character8.svg?react";
import RightArrowIcon from "@/shared/assets/icons/right_arrow.svg?react";
import useResponsive from "@/shared/model/use-responsive";
import { LogoButton } from "@/shared/ui/logo";

export const Route = createFileRoute("/_header-layout/")({
	component: Index,
});

function Index() {
	const { isMobile } = useResponsive();

	return (
		<div className="h-full w-full mobile:p-0 px-5 mobile:pt-6 pt-6">
			<article
				className={
					"relative mb-6 tablet:mb-11 flex flex-col gap-1 rounded-[20px] bg-violet-100 p-5 mobile:px-8 mobile:py-9"
				}
			>
				<p className="font-bold mobile:text-base text-[13px] text-violet-600">
					겜구 커뮤니티에 오신 것을 환영해요 🎉
				</p>
				<p className="font-normal mobile:text-xl text-gray-800 text-sm">
					게임 친구를 쉽고 빠르게 구해줄게요!
				</p>
				{!isMobile && (
					<LogoButton className="-translate-y-1/2 absolute top-1/2 right-[41px] w-[254px] text-violet-300 opacity-40" />
				)}
			</article>
			<section className="flex w-full tablet:flex-row flex-col items-center gap-4 tablet:gap-11 mobile:pb-50 pb-20 tablet:pb-[200px]">
				<HomeCard to="/match" title="바로 매칭하기">
					<Character8Icon className="absolute bottom-0 left-[10%] w-[20%] translate-y-[25%]" />
					<Character6Icon className="absolute top-0 right-[10%] w-[20%] translate-y-[-36%]" />
				</HomeCard>
				<HomeCard to="/board" title="게시판에서 찾기">
					<Character4Icon className="absolute top-0 left-[10%] w-[20%] translate-y-[-36%]" />
					<Book className="absolute right-[22%] bottom-0 w-[20%] translate-y-[5%]" />
					<Character7Icon className="absolute right-[10%] bottom-0 w-[20%] translate-y-[25%]" />
				</HomeCard>
			</section>
		</div>
	);
}

type HomeCardProps = {
	to: string;
	title: string;
	children: React.ReactNode;
};

export default function HomeCard({ to, title, children }: HomeCardProps) {
	return (
		<Link
			to={to}
			className="relative box-border flex aspect-[320/118] mobile:aspect-[320/125] w-full mobile:max-w-[600px] flex-col items-center justify-center overflow-hidden mobile:rounded-4xl rounded-[0.825rem] rounded-[14.83px] bg-gray-800 transition-all duration-200 ease-in hover:bg-gray-900"
		>
			{children}
			<h2 className="z-10 inline-block text-center font-bold mobile:text-[32px] text-base text-white">
				{title}
				<RightArrowIcon className="ml-2.5 inline-block mobile:w-[18px] w-1" />
			</h2>
		</Link>
	);
}
