import type { ApiErrorResponse } from "./@generated";

export function isValidApiError(data: any): data is Required<ApiErrorResponse> {
	return (
		data &&
		typeof data.status === "number" &&
		typeof data.message === "string" &&
		typeof data.code === "string"
	);
}
