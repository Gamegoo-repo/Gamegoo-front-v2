import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { MyProfileResponse } from "@/shared/api";
import { api, tokenManager } from "@/shared/api";

interface AuthUserContextType {
	authUser: MyProfileResponse | null;
	isLoading: boolean;
	error: string | null;
	refetch: () => void;
}

const AuthUserContext = createContext<AuthUserContextType | undefined>(
	undefined,
);

interface AuthUserProviderProps {
	children: ReactNode;
}

export function AuthUserProvider({ children }: AuthUserProviderProps) {
	const token = tokenManager.getRefreshToken();
	const {
		data: authUser,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["member", "getMemberJWT"],
		queryFn: async (): Promise<MyProfileResponse> => {
			const response = await api.member.getMemberJWT();

			if (response.status !== 200 || !response.data?.data) {
				throw new Error(
					response.data?.message || "Failed to fetch user profile",
				);
			}

			const userData = response.data.data;

			if (userData.canRefresh) {
				// 응답을 기다리지 않고 백그라운드에서 실행
				api.member.refreshChampionStats(userData.id);
			}

			return userData;
		},
		enabled: !!token,
	});

	return (
		<AuthUserContext.Provider
			value={{
				authUser: authUser || null,
				isLoading,
				error: error?.message || null,
				refetch,
			}}
		>
			{children}
		</AuthUserContext.Provider>
	);
}

export function useAuthUser() {
	const context = useContext(AuthUserContext);
	if (context === undefined) {
		throw new Error("useAuthUser must be used within an AuthUserProvider");
	}
	return context;
}
