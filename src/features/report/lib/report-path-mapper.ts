import type { ReportPath } from "@/shared/api";

export const ReportPathToNumber: Record<ReportPath, number> = {
	BOARD: 1,
	CHAT: 2,
	PROFILE: 3,
} as const;

/**
 * ReportPath를 API 숫자 형식으로 변환하는 헬퍼 함수
 * @param path - ReportPath enum 값
 * @returns API에 전송할 숫자 (1, 2, 3)
 */
export const reportPathToNumber = (path: ReportPath): number => {
	return ReportPathToNumber[path];
};
