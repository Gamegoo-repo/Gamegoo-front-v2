import { api, type ReportRequest } from "@/shared/api";
import { useMutation } from "@tanstack/react-query";

export default function useSubmitReport() {
	return useMutation({
		mutationFn: async ({
			targetUserId,
			reportRequest,
		}: {
			targetUserId: number;
			reportRequest: ReportRequest;
		}) => {
			const response = await api.private.report.addReport(
				targetUserId,
				reportRequest,
			);
			return response.data;
		},
	});
}
