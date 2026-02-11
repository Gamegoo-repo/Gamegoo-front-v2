import { useLocation, useRouter } from "@tanstack/react-router";
import { useMatchUiStore } from "../../model/store/useMatchUiStore";

export const FloatingMatchingCard = () => {
	const router = useRouter();
	const { isMatching, timeLeft, sessionId } = useMatchUiStore();
	const location = useLocation();
	const isMatchPage = location.pathname.startsWith("/match");
	if (!isMatching) return null;
	if (isMatchPage) return null;
	return (
		<div className="fixed left-6 bottom-6 z-50 animate-slide-in">
			<div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-xl">
				<div className="flex flex-col">
					<span className="text-sm font-semibold">매칭중</span>
					<span className="text-xs text-gray-500">
						{timeLeft > 0 ? `${timeLeft}초 남음` : "대기 중..."}
					</span>

					<button
						className="text-xs text-blue-600"
						onClick={() => router.navigate({ to: "/match" })}
					>
						보기
					</button>

					<button
						className="text-xs text-red-500"
						onClick={() => matchFlow.cancel(sessionId)}
					>
						취소
					</button>
				</div>
			</div>
		</div>
	);
};
