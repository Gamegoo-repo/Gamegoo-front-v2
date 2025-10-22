import axios, { type AxiosError, type AxiosInstance } from "axios";
import { Configuration } from "./@generated/configuration";

// 토큰 관리 - 액세스 토큰은 메모리, 리프레시 토큰은 로컬스토리지
let accessToken: string | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export const tokenManager = {
	getAccessToken: () => accessToken,
	getRefreshToken: () => {
		if (typeof window !== "undefined" && window.localStorage) {
			return localStorage.getItem("refreshToken");
		}
		return null;
	},
	setTokens: (newAccessToken: string, newRefreshToken?: string) => {
		accessToken = newAccessToken;
		if (
			newRefreshToken &&
			typeof window !== "undefined" &&
			window.localStorage
		) {
			localStorage.setItem("refreshToken", newRefreshToken);
		}
	},
	clearTokens: () => {
		accessToken = null;
		isRefreshing = false;
		refreshPromise = null;
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.removeItem("refreshToken");
		}
	},
};

// API 기본 URL
const API_BASE_URL =
	import.meta.env.PUBLIC_API_BASE_URL || "https://api.gamegoo.co.kr";

// axios 인스턴스
export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
	(config) => {
		const token = tokenManager.getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// refresh 토큰 함수
const refreshAccessToken = async (): Promise<string> => {
	if (isRefreshing && refreshPromise) {
		return refreshPromise;
	}

	isRefreshing = true;
	refreshPromise = (async () => {
		const refreshToken = tokenManager.getRefreshToken();
		if (!refreshToken) {
			// refresh 토큰이 없으면 토큰 정리
			tokenManager.clearTokens();
			throw new Error("No refresh token available");
		}

		try {
			const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
				refreshToken,
			});

			console.log("Refresh response:", refreshResponse.data);
			const data = refreshResponse.data?.data;
			if (data?.accessToken) {
				tokenManager.setTokens(data.accessToken, data.refreshToken);
				console.log("Token refresh successful");
				return data.accessToken;
			} else {
				console.error(
					"Invalid refresh response structure:",
					refreshResponse.data,
				);
				throw new Error("Invalid refresh response");
			}
		} catch (refreshError) {
			console.error("Token refresh failed:", refreshError);
			tokenManager.clearTokens();
			throw refreshError;
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	})();

	return refreshPromise;
};

// 응답 인터셉터 - 토큰 갱신 및 에러 처리
apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosError["config"] & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			console.log("401 error detected, attempting token refresh...");
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken();
				console.log("Token refresh successful, retrying original request");

				// 원래 요청 재시도
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}
				return apiClient(originalRequest);
			} catch (refreshError) {
				console.error("Token refresh failed:", refreshError);
				// refresh 실패 시 토큰 정리하고 원래 에러 반환
				tokenManager.clearTokens();
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

// OpenAPI Configuration
export const apiConfiguration = new Configuration({
	basePath: API_BASE_URL,
	accessToken: () => {
		const token = tokenManager.getAccessToken();
		return token || "";
	},
});
