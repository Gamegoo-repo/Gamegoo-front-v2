import { createFileRoute, Link } from "@tanstack/react-router";
import Book from "@/shared/assets/characters/book.svg?react";
import Character4 from "@/shared/assets/characters/character4.svg?react";
import Character6 from "@/shared/assets/characters/character6.svg?react";
import Character7 from "@/shared/assets/characters/character7.svg?react";
import Character8 from "@/shared/assets/characters/character8.svg?react";
import Arrow from "@/shared/assets/icons/arrow_right.svg?react";
import useResponsive from "@/shared/model/use-responsive";
import { Logo } from "@/shared/ui/logo";

export const Route = createFileRoute("/_header-layout/")({
	component: Index,
});

function Index() {
	const { isMobile } = useResponsive();

	return (
		<div className="w-full h-full pt-6 px-5 mobile:p-0 mobile:pt-6">
			<article
				className={
					"relative flex flex-col gap-1 p-5 mobile:px-8 mobile:py-9 rounded-[20px] bg-violet-100 mb-6 tablet:mb-11"
				}
			>
				<p className="font-bold text-[13px] mobile:text-base  text-violet-600 ">
					겜구 커뮤니티에 오신 것을 환영해요 🎉
				</p>
				<p className=" font-normal text-sm mobile:text-xl text-gray-800 ">
					게임 친구를 쉽고 빠르게 구해줄게요!
				</p>
				{!isMobile && (
					<Logo className="absolute text-violet-300 right-[41px] top-1/2 -translate-y-1/2 opacity-40 w-[254px]" />
				)}
			</article>
			<section className="w-full flex tablet:flex-row items-center flex-col gap-4 tablet:gap-11 pb-20 mobile:pb-50 tablet:pb-[200px]">
				<HomeCard to="/match" title="바로 매칭하기">
					<Character8 className="w-[20%] absolute bottom-0 translate-y-[25%] left-[10%]" />
					<Character6 className="w-[20%] absolute top-0 translate-y-[-36%] right-[10%]" />
				</HomeCard>
				<HomeCard to="/board" title="게시판에서 찾기">
					<Character4 className="w-[20%] absolute top-0 translate-y-[-36%] left-[10%]" />
					<Book className="w-[20%] absolute bottom-0 translate-y-[5%] right-[22%]" />
					<Character7 className="w-[20%] absolute bottom-0 translate-y-[25%] right-[10%]" />
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
			className="hover:bg-gray-900 transition-all ease-in duration-200 flex flex-col justify-center items-center rounded-[0.825rem] mobile:rounded-4xl relative w-full mobile:max-w-[600px] aspect-[320/118] mobile:aspect-[320/125] box-border rounded-[14.83px] bg-gray-800 overflow-hidden"
		>
			{children}
			<h2 className="font-bold text-base mobile:text-[32px] inline-block text-center text-white z-10 ">
				{title}
				<Arrow className="inline-block ml-2.5 w-1 mobile:w-[18px]" />
			</h2>
		</Link>
	);
}
