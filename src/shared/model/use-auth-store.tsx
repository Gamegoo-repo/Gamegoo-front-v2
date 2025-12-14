import { create } from "zustand";
import type { LoginSuccessParams } from "@/entities/auth/model/types";
import { api, tokenManager } from "../api";

/** TODO: BAN 정보도 저장할지 isBanned 정도만? */
export interface UserStore {
	id: number;
	name: string;
	tag: string;
	profileImage: number;
}

interface AuthStore {
	isAuthenticated: boolean;
	user: UserStore | null;
	login: (response: LoginSuccessParams | Tokens) => void;
	logout: () => void;
	validateToken: () => void;
	initializeAuth: () => void;
}

type Tokens = { accessToken: string; refreshToken: string };

export const useAuthStore = create<AuthStore>((set, get) => ({
	// 로그인 여부 판단
	isAuthenticated: !!tokenManager.getAccessToken(),

	// 사용자 정보 저장
	user: null,

	// 최상단 컴포넌트에서 호출할 auth 초기화 함수
	initializeAuth: async () => {
		const accessToken = tokenManager.getAccessToken();
		const refreshToken = tokenManager.getRefreshToken();

		if (!accessToken && !refreshToken) {
			set({ isAuthenticated: false, user: null });
			return; // 토큰이 없으므로 초기화 종료
		} else if (!accessToken && refreshToken) {
			try {
				const response = await api.private.auth.updateToken({ refreshToken });

				if (response.data.data) {
					const { accessToken, refreshToken } = response.data.data;
					get().login({ accessToken, refreshToken });
				}
			} catch (_e) {
				set({ isAuthenticated: false, user: null });
				return;
			}
		}

		// accessToken이 있는 경우 -> 프로필 조회
		try {
			const response = await api.private.member.getMemberJWT();

			// 프로필 조회한 경우
			if (response.data.data) {
				const { id, gameName, tag, profileImg } = response.data.data;

				// 프로필 정보 저장
				set({
					isAuthenticated: true,
					user: {
						id: Number(id),
						name: gameName,
						tag: tag,
						profileImage: Number(profileImg),
					},
				});
			}
		} catch (_error) {
			tokenManager.clearTokens();
			set({ isAuthenticated: false, user: null });
		}
	},

	login: (response: LoginSuccessParams | Tokens) => {
		tokenManager.setTokens(response.accessToken, response.refreshToken);

		if ("id" in response) {
			//  LoginSuccessParams 타입
			set({
				isAuthenticated: true,
				user: {
					id: Number(response.id),
					name: response.name,
					tag: response.tag,
					profileImage: Number(response.profileImage),
				},
			});
		} else {
			// Tokens 타입
			set({ isAuthenticated: true });
		}
	},

	logout: () => {
		tokenManager.clearTokens();
		set({ isAuthenticated: false, user: undefined });
	},

	validateToken: () => {
		if (!tokenManager.getAccessToken()) {
			get().logout();
		}
	},
}));
