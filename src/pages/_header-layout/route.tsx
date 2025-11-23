import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/shared/ui/footer/footer";
import Header from "@/widgets/header/ui/header";

export const Route = createFileRoute("/_header-layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col h-full w-full lg:items-center">
			<div className="flex flex-col w-full min-h-screen desktop:max-w-[1216px] mobile:px-10 tablet:px-15 desktop:px-0">
				<div className="mb-6">
					<Header />
				</div>
				<main className="w-full flex-1">
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	);
}
