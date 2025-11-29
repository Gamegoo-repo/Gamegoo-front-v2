import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { userKeys } from "@/entities/user/config/query-keys";
import { api } from "@/shared/api";
import MannerKeywordsCard from "@/widgets/user-info/manner-keywords-card";
import MannerLevelCard from "@/widgets/user-info/manner-level-card";

export const Route = createFileRoute("/_header-layout/mypage/review")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: me } = useFetchMyInfo();
	const myId = me?.id;

	const {
		data: mannerLevel,
		isLoading: loadingLevel,
		isError: errorLevel,
	} = useQuery({
		queryKey: myId
			? userKeys.mannerDetail(myId, "level")
			: ["manner", "me", "level"],
		queryFn: async () => {
			if (!myId) return undefined;
			const { data } = await api.private.manner.getMannerLevelInfo(myId);
			return data.data;
		},
		enabled: Boolean(myId),
	});

	const {
		data: mannerKeywords,
		isLoading: loadingKeywords,
		isError: errorKeywords,
	} = useQuery({
		queryKey: myId
			? userKeys.mannerDetail(myId, "keywords")
			: ["manner", "me", "keywords"],
		queryFn: async () => {
			if (!myId) return undefined;
			const { data } = await api.private.manner.getMannerKeywordInfo(myId);
			return data.data;
		},
		enabled: Boolean(myId),
	});

	const isLoading = loadingLevel || loadingKeywords;
	const isError = errorLevel || errorKeywords;

	return (
		<div className="h-full w-full">
			<h2 className="bold-25 mb-4 border-gray-200 border-b pb-4">내 평가</h2>

			{isLoading && (
				<div className="flex h-[300px] items-center justify-center text-gray-500">
					불러오는 중...
				</div>
			)}

			{isError && (
				<div className="flex h-[300px] items-center justify-center text-red-500">
					내 평가 정보를 불러오지 못했습니다.
				</div>
			)}

			{!isLoading && !isError && me && mannerLevel && mannerKeywords && (
				<div className="flex w-full flex-col gap-9">
					<MannerLevelCard
						userProfile={{ gameName: me.gameName }}
						userMannerLevelData={mannerLevel}
					/>

					<div className="flex w-full gap-3">
						<MannerKeywordsCard
							title={"받은 매너 평가"}
							keywords={mannerKeywords.mannerKeywords.slice(0, 6)}
							type="positive"
						/>
						<MannerKeywordsCard
							title={"받은 비매너 평가"}
							keywords={mannerKeywords.mannerKeywords.slice(6)}
							type="negative"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
