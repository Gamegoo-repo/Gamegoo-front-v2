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
		<nav className="flex grow justify-start ml-0 mobile:ml-[70px] px-5 mobile:px-0 gap-[42px] mobile:gap-10 mobile:col-span-2 w-full mobile:w-auto  mt-4 mobile:mt-0  border-b border-gray-300 mobile:border-none">
			{visibleMenus.map((menu) => (
				<Link
					key={menu.href}
					to={menu.href}
					activeOptions={{ exact: true }}
					className="
						py-2.5 
						text-sm mobile:text-xl
						font-semibold mobile:font-normal
						text-gray-800
						[&.active]:border-b-[3px] [&.active]:border-gray-800
						mobile:[&.active]:border-b-0
						mobile:[&.active]:font-bold
					"
				>
					{menu.label}
				</Link>
			))}
		</nav>
	);
}
