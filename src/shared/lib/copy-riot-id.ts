export type CopyRiotIdParams = {
	gameName: string;
	tag: string;
};

/**
 * Riot ID를 클립보드에 복사합니다. (예: "Hide on bush#KR1")
 * - gameName의 공백은 제거합니다.
 * - 성공/실패 여부만 반환합니다. (toast 등 UI 처리는 호출부에서)
 */
export async function copyRiotIdToClipboard({
	gameName,
	tag,
}: CopyRiotIdParams): Promise<{ ok: boolean; text: string }> {
	const text = `${(gameName || "").replace(/\s+/g, "")}#${tag || ""}`;
	try {
		await navigator.clipboard.writeText(text);
		return { ok: true, text };
	} catch {
		return { ok: false, text };
	}
}
