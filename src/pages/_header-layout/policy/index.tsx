import { TERMS } from "@/entities/term/model";
import LoadingSpinner from "@/shared/ui/loading-spinner/loading-spinner";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import z from "zod";

const termSearchSchema = z.object({
	term: z.enum(["privacy", "service"]),
});

export const Route = createFileRoute("/_header-layout/policy/")({
	component: RouteComponent,
	validateSearch: termSearchSchema,
	onError: () => {
		throw notFound({ routeId: "__root__" });
	},
});

const termComponents = {
	service: lazy(() => import("@/entities/term/ui/service-term-content")),
	marketing: lazy(() => import("@/entities/term/ui/marketing-term-content")),
	privacy: lazy(() => import("@/entities/term/ui/privacy-term-content")),
} as const;

function RouteComponent() {
	const { term } = Route.useSearch();

	const { label } = TERMS.find((t) => t.key === term) ?? {};

	const TermContent = term ? termComponents[term] : null;

	return (
		<section className="flex h-full min-h-screen w-full flex-col items-center gap-5 mobile:px-0 px-5 mobile:pt-[60px] mobile:pb-28 pb-10">
			<header className="flex w-full flex-col items-center gap-4 mobile:gap-5">
				<h2 className="w-full border-gray-400 border-b mobile:pb-2.5 pb-2 text-center font-bold mobile:text-2xl text-gray-700 text-lg">
					겜구 약관 및 개인정보 보호
				</h2>
				<nav className="flex items-center">
					<Link
						to={"/policy"}
						search={{ term: "service" }}
						className="border-1 border-gray-300 p-2 mobile:px-5 mobile:py-3 font-medium mobile:text-lg text-gray-800 text-sm transition-all duration-100 hover:border-gray-400 hover:text-gray-600 [&.active]:border-1 [&.active]:border-violet-600 mobile:[&.active]:font-bold [&.active]:text-violet-600"
					>
						이용 약관
					</Link>
					<Link
						to={"/policy"}
						search={{ term: "privacy" }}
						className="border-1 border-gray-300 p-2 mobile:px-5 mobile:py-3 font-medium mobile:text-lg text-gray-800 text-sm transition-all duration-100 hover:border-gray-400 hover:text-gray-600 [&.active]:border-1 [&.active]:border-violet-600 mobile:[&.active]:font-bold [&.active]:text-violet-600"
					>
						개인 정보 처리 방침
					</Link>
				</nav>
			</header>

			<div className="flex w-full flex-1 flex-col gap-2 mobile:gap-5">
				<h3 className="flex w-full items-center gap-0.5 font-bold mobile:text-xl text-base text-gray-800">
					{label}
					<span className={"inline-block text-violet-600"}>(필수)</span>
				</h3>

				<article className="flex w-full flex-1 flex-col overflow-y-auto break-keep rounded-xl bg-gray-200 mobile:px-6 px-[14px] mobile:py-7 py-[19px] mobile:text-lg text-gray-800 text-sm">
					<Suspense
						fallback={
							<div className="flex flex-1 items-center justify-center">
								<LoadingSpinner />
							</div>
						}
					>
						{TermContent && <TermContent />}
					</Suspense>
				</article>
			</div>
		</section>
	);
}
