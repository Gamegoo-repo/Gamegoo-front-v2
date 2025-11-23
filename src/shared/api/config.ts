import axios, { type AxiosError, type AxiosInstance } from "axios";
import { Configuration } from "./@generated/configuration";

// 토큰 관리 - 액세스 토큰은 메모리, 리프레시 토큰은 로컬스토리지
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token || "");
		}
	});

	failedQueue = [];
};

export const tokenManager = {
	getAccessToken: () => {
		if (typeof window !== "undefined" && window.localStorage) {
			return localStorage.getItem("accessToken");
		}
		return null;
	},
	getRefreshToken: () => {
		if (typeof window !== "undefined" && window.localStorage) {
			return localStorage.getItem("refreshToken");
		}
		return null;
	},
	setTokens: (newAccessToken: string, newRefreshToken?: string) => {
		localStorage.setItem("accessToken", newAccessToken);
		if (
			newRefreshToken &&
			typeof window !== "undefined" &&
			window.localStorage
		) {
			localStorage.setItem("refreshToken", newRefreshToken);
		}
	},
	clearTokens: () => {
		isRefreshing = false;
		refreshPromise = null;
		if (typeof window !== "undefined" && window.localStorage) {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("accessToken");
		}
	},
	refreshToken: () => refreshAccessToken(),
	getIsRefreshing: () => isRefreshing,
};

// API 기본 URL
const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

// axios 인스턴스 - 인증 필요
export const privateApiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// axios 인스턴스 - 인증 불필요
export const publicApiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	},
});

// 요청 인터셉터 - JWT 토큰 자동 추가
privateApiClient.interceptors.request.use(
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
		// 이미 갱신 중이면 큐에 추가하고 대기
		return new Promise((resolve, reject) => {
			failedQueue.push({ resolve, reject });
		});
	}

	isRefreshing = true;
	refreshPromise = (async () => {
		const refreshToken = tokenManager.getRefreshToken();
		if (!refreshToken) {
			// refresh 토큰이 없으면 토큰 정리
			const error = new Error("No refresh token available");
			processQueue(error, null);
			tokenManager.clearTokens();
			throw error;
		}

		try {
			const refreshResponse = await axios.post(
				`${API_BASE_URL}/api/v2/auth/refresh`,
				{
					refreshToken,
				},
			);

			const data = refreshResponse.data?.data;
			if (data?.accessToken) {
				tokenManager.setTokens(data.accessToken, data.refreshToken);
				processQueue(null, data.accessToken);
				return data.accessToken;
			} else {
				const error = new Error("Invalid refresh response");
				processQueue(error, null);
				throw error;
			}
		} catch (refreshError) {
			processQueue(new Error(String(refreshError)), null);
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
privateApiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosError["config"] & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const newAccessToken = await refreshAccessToken();

				// 원래 요청 재시도
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}
				return privateApiClient(originalRequest);
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
export const privateApiConfiguration = new Configuration({
	basePath: API_BASE_URL,
	accessToken: () => {
		const token = tokenManager.getAccessToken();
		return token || "";
	},
});

export const publicApiConfiguration = new Configuration({
	basePath: API_BASE_URL,
});
