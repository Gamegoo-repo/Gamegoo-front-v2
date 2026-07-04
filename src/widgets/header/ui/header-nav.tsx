import { Link } from '@tanstack/react-router';

import useResponsive from '@/shared/model/use-responsive';

type MenuItem = {
  label: string;
  href: string;
  showOnDesktop?: boolean;
  showOnMobile?: boolean;
};

const menus: MenuItem[] = [
  { label: '홈', href: '/', showOnDesktop: false },
  { label: '바로 매칭', href: '/match' },
  { label: '게시판', href: '/board' },
  { label: '롤BTI', href: '/lolbti' },
];

export default function HeaderNav() {
  const { isMobile } = useResponsive();

  const visibleMenus = menus.filter((menu) => {
    if (isMobile) {
      return menu.showOnMobile !== false;
    }
    return menu.showOnDesktop !== false;
  });

  return (
    <nav className="mt-4 ml-0 flex w-full grow justify-start gap-[42px] border-b border-gray-300 px-5 mobile:col-span-2 mobile:mt-0 mobile:ml-[70px] mobile:w-auto mobile:gap-10 mobile:border-none mobile:px-0">
      {visibleMenus.map((menu) => (
        <Link
          key={menu.href}
          to={menu.href}
          activeOptions={{ exact: false }}
          className="py-2.5 text-sm font-semibold text-gray-800 mobile:text-xl mobile:font-normal [&.active]:border-b-[3px] [&.active]:border-gray-800 mobile:[&.active]:border-b-0 mobile:[&.active]:font-bold"
        >
          {menu.label}
        </Link>
      ))}
    </nav>
  );
}
