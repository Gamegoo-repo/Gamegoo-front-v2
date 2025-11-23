import { useAuthStore } from "./use-auth-store";

export function useAuth() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const user = useAuthStore((s) => s.user);
	const logout = useAuthStore((s) => s.logout);
	const initializeAuth = useAuthStore((s) => s.initializeAuth);

	return {
		isAuthenticated,
		initializeAuth,
		user,
		logout,
	};
}
