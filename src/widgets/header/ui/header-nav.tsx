import { Link } from "@tanstack/react-router";
import useResponsive from "@/shared/model/use-responsive";

type MenuItem = {
	label: string;
	href: string;
	showOnDesktop?: boolean;
	showOnMobile?: boolean;
};

const menus: MenuItem[] = [
	{ label: "홈", href: "/", showOnDesktop: false },
	{ label: "바로 매칭", href: "/match" },
	{ label: "게시판", href: "/board" },
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
		<nav className="mobile:col-span-2 mobile:mt-0 mt-4 ml-0 mobile:ml-[70px] flex mobile:w-auto w-full grow justify-start gap-[42px] mobile:gap-10 border-gray-300 border-b mobile:border-none mobile:px-0 px-5">
			{visibleMenus.map((menu) => (
				<Link
					key={menu.href}
					to={menu.href}
					activeOptions={{ exact: true }}
					className="py-2.5 font-semibold mobile:font-normal mobile:text-xl text-gray-800 text-sm [&.active]:border-gray-800 [&.active]:border-b-[3px] mobile:[&.active]:border-b-0 mobile:[&.active]:font-bold"
				>
					{menu.label}
				</Link>
			))}
		</nav>
	);
}
