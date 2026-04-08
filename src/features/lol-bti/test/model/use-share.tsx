type ShareResult = "shared" | "copied" | "cancelled" | "error";

interface ShareOptions {
	title?: string;
	text?: string;
	url?: string;
	files?: File[];
}

export function useShare() {
	const share = async (options: ShareOptions): Promise<ShareResult> => {
		const { files, url = window.location.href, ...rest } = options;

		// 파일 공유 시도
		if (files?.length) {
			const shareData = { files, ...rest };

			// canShare()로 파일 공유 가능 여부 사전 체크
			if (navigator.canShare?.(shareData)) {
				try {
					await navigator.share(shareData);
					return "shared";
				} catch (err) {
					if (err instanceof DOMException && err.name === "AbortError") {
						return "cancelled"; // 사용자가 직접 닫은 것 → 에러 아님
					}
					// 파일 공유 실패 → URL 공유로 fallback
				}
			}
		}

		// URL 공유 시도
		if ("share" in navigator) {
			try {
				await navigator.share({ url, ...rest });
				return "shared";
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") {
					return "cancelled";
				}
			}
		}

		// 최종 fallback → 클립보드 복사
		try {
			await navigator.clipboard.writeText(url);
			return "copied";
		} catch {
			return "error";
		}
	};

	return { share };
}
