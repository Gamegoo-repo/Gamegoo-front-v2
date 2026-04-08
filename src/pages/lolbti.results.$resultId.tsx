import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	convertPayloadToAxisPercentages,
	LolBtiResultSection,
} from "@/features/lol-bti";
import { getLolBtiResultByResultId } from "@/features/lol-bti/test/api/lolbti-integration-api";
import LolBtiLoadingSection from "@/features/lol-bti/test/ui/lolbti-loading-section";

export const Route = createFileRoute("/lolbti/results/$resultId")({
	loader: ({ params }) => getLolBtiResultByResultId(params.resultId),
	pendingComponent: LolBtiLoadingSection, //TODO: 수정해야 함
	component: RouteComponent,
});

function RouteComponent() {
	const result = Route.useLoaderData();
	const { resultId } = Route.useParams();
	const navigate = useNavigate();
	const axisPercentages = convertPayloadToAxisPercentages(result.resultPayload);

	if (!result) {
		navigate({ to: "/" });
		return undefined;
	}

	return (
		<LolBtiResultSection
			title="롤BTI 결과"
			lolBti={result.type}
			resultId={resultId}
			axisPercentages={axisPercentages}
			footer={
				<Link
					to={"/lolbti/test"}
					className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-violet-600 py-4 font-bold text-base text-white leading-none transition-all duration-300 hover:text-gray-300 active:scale-95"
				>
					나도 롤비티아이 검사하기
				</Link>
			}
		/>
	);
}
