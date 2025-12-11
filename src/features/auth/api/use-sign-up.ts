import { useMutation } from "@tanstack/react-query";
import {
	api,
	type ApiErrorResponse,
	type BanType,
	type RiotJoinRequest,
} from "@/shared/api";
import { useAuthStore } from "@/shared/model/use-auth-store";
import type { RiotJoinResponse } from "@/shared/api/@generated/models/riot-join-response";
import type { AxiosError } from "axios";
import { toast } from "@/shared/lib/toast";
import { useNavigate } from "@tanstack/react-router";
import { isValidApiError } from "@/shared/api/guard";
type RequiredApiErrorResponse = Required<ApiErrorResponse>;

export const useSignUp = () => {
	const auth = useAuthStore();
	const navigate = useNavigate();
	const query = useMutation({
		mutationFn: async (request: RiotJoinRequest) => {
			const response = await api.public.riot.joinByRSO(request);

			const data = response.data.data as RiotJoinResponse;

			if (
				!data ||
				!data.accessToken ||
				!data.refreshToken ||
				!data.id ||
				!data.name ||
				!data.tag
			) {
				throw new Error("Invalid signup response: missing required fields");
			}

			return data;
		},
		onSuccess: (data) => {
			auth.login({
				accessToken: data.accessToken || "",
				refreshToken: data.refreshToken || "",
				id: String(data.id),
				name: data.name || "",
				tag: data.tag || "",
				profileImage: String(data.profileImage),
				status: "LOGIN_SUCCESS",
				banType: "NONE" as BanType,
				banExpireAt: "",
				isBanned: false,
			});

			navigate({ to: "/" });
		},
		onError: (error: AxiosError<ApiErrorResponse>) => {
			const errorData = error.response?.data;

			if (!isValidApiError(errorData)) {
				toast.error("알 수 없는 오류가 발생했습니다.");
				return;
			}

			if (errorData?.status >= 400 && errorData.status < 500) {
				toast.error(errorData.message);
				navigate({ to: "/riot" });
			}
		},
	});

	return {
		...query,
	};
};
