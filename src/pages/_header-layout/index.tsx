import { FlexBox } from '@gamegoo-ui/design-system';
import { createFileRoute, Link } from '@tanstack/react-router';

import Book from '@/shared/assets/characters/book.svg?react';
import Character4Icon from '@/shared/assets/characters/character4.svg?react';
import Character6Icon from '@/shared/assets/characters/character6.svg?react';
import Character7Icon from '@/shared/assets/characters/character7.svg?react';
import Character8Icon from '@/shared/assets/characters/character8.svg?react';
import RightArrowIcon from '@/shared/assets/icons/right_arrow.svg?react';
import useResponsive from '@/shared/model/use-responsive';
import { LogoButton } from '@/shared/ui/logo';

export const Route = createFileRoute('/_header-layout/')({
  component: Index,
});

function Index() {
  const { isMobile } = useResponsive();

  return (
    <div className="h-full w-full px-5 pt-6 mobile:p-0 mobile:pt-6">
      <article
        className={
          'relative mb-6 flex flex-col gap-1 rounded-[20px] bg-violet-100 p-5 mobile:px-8 mobile:py-9 tablet:mb-11'
        }
      >
        <p className="text-[13px] font-bold text-violet-600 mobile:text-base">
          겜구 커뮤니티에 오신 것을 환영해요 🎉
        </p>
        <p className="text-sm font-normal text-gray-800 mobile:text-xl">
          게임 친구를 쉽고 빠르게 구해줄게요!
        </p>
        {!isMobile && (
          <LogoButton className="absolute top-1/2 right-[41px] w-[254px] -translate-y-1/2 text-violet-300 opacity-40" />
        )}
      </article>
      <article
        className={
          'relative mb-6 flex flex-col items-center gap-3 overflow-hidden rounded-[15px] bg-violet-400 p-5 mobile:items-start mobile:gap-4 mobile:rounded-[20px] mobile:px-15 mobile:py-7 tablet:mb-11'
        }
      >
        <h2 className="text-base font-extrabold text-white mobile:text-[32px]">
          나는 어떤 유형일까?
        </h2>
        <Link
          to="/lolbti/test"
          className="flex items-center gap-2 rounded-[14px] bg-violet-500 px-6 py-2 text-sm font-bold text-white mobile:px-7 mobile:py-3 mobile:text-base"
        >
          롤BTI 검사하러 가기
          <RightArrowIcon className="size-4.5" />
        </Link>
        <div className="absolute top-0 right-0 bottom-0 left-1/2 hidden h-full mobile:block">
          <img
            alt="banner-bg"
            src={'/assets/images/banner-bg.png'}
            className="h-full w-full object-cover object-left"
          />
        </div>
      </article>

      <section className="flex w-full flex-col items-center gap-4 pb-20 mobile:pb-50 tablet:flex-row tablet:gap-11 tablet:pb-[200px]">
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
      className="relative box-border flex aspect-[320/118] w-full flex-col items-center justify-center overflow-hidden rounded-[0.825rem] rounded-[14.83px] bg-gray-800 transition-all duration-200 ease-in hover:bg-gray-900 mobile:aspect-[320/125] mobile:max-w-[600px] mobile:rounded-4xl"
    >
      {children}
      <h2 className="z-10 inline-block text-center text-base font-bold text-white mobile:text-[32px]">
        {title}
        <RightArrowIcon className="ml-2.5 inline-block w-1 mobile:w-[18px]" />
      </h2>
    </Link>
  );
}
