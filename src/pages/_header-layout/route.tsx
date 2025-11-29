import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/shared/ui/footer/footer";
import Header from "@/widgets/header/ui/header";

export const Route = createFileRoute("/_header-layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-full w-full flex-col lg:items-center">
			<div className="flex min-h-screen w-full desktop:max-w-[1216px] flex-col desktop:px-0 mobile:px-10 tablet:px-15">
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
