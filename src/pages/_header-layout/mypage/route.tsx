import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/mypage")({
	component: MyPageLayout,
});

function MyPageLayout() {
	return (
		<div className="flex h-full w-full gap-8 py-[40px]">
			<aside className="mobile:block hidden w-[220px] flex-shrink-0">
				<nav className="flex h-100 flex-col justify-center gap-4">
					<MyPageNavItem to="/mypage/profile" label="내 정보" />
					<MyPageNavItem to="/mypage/notification" label="알림" />
					<MyPageNavItem to="/mypage/post" label="내가 작성한 글" />
					<MyPageNavItem to="/mypage/review" label="내 평가" />
					<MyPageNavItem to="/mypage/blocked" label="차단목록" />
					<MyPageNavItem to="/mypage/service" label="고객센터" />
				</nav>
			</aside>
			<section className="min-w-0 flex-1 mobile:px-0 px-[20px]">
				<Outlet />
			</section>
		</div>
	);
}

type MyPageNavItemProps = {
	to: string;
	label: string;
};

function MyPageNavItem({ to, label }: MyPageNavItemProps) {
	return (
		<Link
			to={to}
			activeOptions={{ exact: false }}
			className="regular-16 rounded-xl px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
			activeProps={{
				className: "bg-gray-100 text-gray-900 bold-16",
			}}
		>
			{label}
		</Link>
	);
}
