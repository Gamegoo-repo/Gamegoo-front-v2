export const REPORT_ERROR_MESSAGES = {
	REPORT_402: "해당 신고 건을 찾을 수 없습니다",
	REPORT_403:
		"신고 접수 경로 정보를 찾을 수 없습니다.\n관리자에게 문의 바랍니다",
	REPORT_404:
		"해당 회원에 대한 신고가 이미 등록되었습니다.\n내일 다시 시도해주세요.",
} as const;

export const isReportErrorCode = (
	code: string,
): code is keyof typeof REPORT_ERROR_MESSAGES => {
	return code in REPORT_ERROR_MESSAGES;
};
