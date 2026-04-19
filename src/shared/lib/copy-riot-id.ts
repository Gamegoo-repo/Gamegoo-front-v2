export type CopyRiotIdParams = {
	gameName: string;
	tag: string;
};

// iOS Safari는 gesture context 만료 시 clipboard API를 거부하므로 execCommand로 fallback
const copyViaExecCommand = (text: string): boolean => {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.style.cssText =
		"position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	const success = document.execCommand("copy");
	document.body.removeChild(textarea);
	return success;
};

export async function copyTextToClipboard(
	text: string,
): Promise<{ ok: boolean; text: string }> {
	try {
		await navigator.clipboard.writeText(text);
		return { ok: true, text };
	} catch {
		const success = copyViaExecCommand(text);
		return { ok: success, text };
	}
}

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
		const success = copyViaExecCommand(text);
		return { ok: success, text };
	}
}
