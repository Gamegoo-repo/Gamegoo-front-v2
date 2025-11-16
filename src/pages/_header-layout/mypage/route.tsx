import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/mypage")({
	component: MyPageLayout,
});

function MyPageLayout() {
	return (
		<div className="w-full h-full flex gap-8">
			<aside className="w-[220px] flex-shrink-0">
				<nav className="flex flex-col gap-4 h-100 justify-center">
					<MyPageNavItem to="/mypage/profile" label="내 정보" />
					<MyPageNavItem to="/mypage/notification" label="알림" />
					<MyPageNavItem to="/mypage/post" label="내가 작성한 글" />
					<MyPageNavItem to="/mypage/review" label="내 평가" />
					<MyPageNavItem to="/mypage/blocked" label="차단목록" />
					<MyPageNavItem to="/mypage/service" label="고객센터" />
				</nav>
			</aside>
			<section className="flex-1 min-w-0">
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
			className="px-4 py-3 rounded-xl regular-16 text-gray-700 hover:bg-gray-100 transition-colors"
			activeProps={{
				className: "bg-gray-100 text-gray-900 bold-16",
			}}
		>
			{label}
		</Link>
	);
}
