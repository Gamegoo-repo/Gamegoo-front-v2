import { Navigate, useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { tokenManager } from "@/shared/api/config";
import { useRefreshToken } from "../api/auth-api";

interface RouteGuardProps {
	children: ReactNode;
	requireAuth?: boolean;
	requireGuest?: boolean;
	fallbackPath?: string;
	onUnauthorized?: () => void;
}

/**
 * 라우트 접근 권한을 관리하는 가드 컴포넌트
 *
 * @param requireAuth - 인증이 필요한 경우 true
 * @param requireGuest - 게스트만 접근 가능한 경우 true (로그인 페이지 등)
 * @param fallbackPath - 조건 미충족시 리다이렉트할 경로
 * @param onUnauthorized - 인증 실패시 실행할 콜백
 */
export function RouteGuard({
	children,
	requireAuth = false,
	requireGuest = false,
	fallbackPath = "/riot",
	onUnauthorized,
}: RouteGuardProps) {
	const location = useLocation();
	const [isChecking, setIsChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const refreshTokenMutation = useRefreshToken();

	useEffect(() => {
		const checkAuth = async () => {
			const accessToken = tokenManager.getAccessToken();
			const refreshToken = tokenManager.getRefreshToken();

			// Access token이 있으면 인증된 것으로 간주
			if (accessToken) {
				setIsAuthenticated(true);
				setIsChecking(false);
				return;
			}

			// Refresh token만 있는 경우 토큰 갱신 시도
			if (refreshToken && requireAuth) {
				try {
					await refreshTokenMutation.mutateAsync(refreshToken);
					setIsAuthenticated(true);
				} catch (error) {
					console.warn("Token refresh failed in route guard:", error);
					setIsAuthenticated(false);
					tokenManager.clearTokens();
					onUnauthorized?.();
				}
			} else {
				setIsAuthenticated(false);
			}

			setIsChecking(false);
		};

		checkAuth();
	}, [location.pathname]);

	// 인증 체크 중일 때 로딩 표시
	if (isChecking) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
			</div>
		);
	}

	// 인증이 필요한데 인증되지 않은 경우
	if (requireAuth && !isAuthenticated) {
		// 현재 위치를 저장하여 로그인 후 돌아올 수 있도록 함
		sessionStorage.setItem("redirectAfterLogin", location.href);
		return <Navigate to={fallbackPath} replace />;
	}

	// 게스트만 접근 가능한데 인증된 경우
	if (requireGuest && isAuthenticated) {
		// 저장된 리다이렉트 경로가 있으면 그곳으로, 없으면 홈으로
		const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/";
		sessionStorage.removeItem("redirectAfterLogin");
		return <Navigate to={redirectPath} replace />;
	}

	return <>{children}</>;
}

/**
 * 권한 기반 라우트 가드
 * 특정 권한이나 역할이 필요한 라우트에서 사용
 */
interface PermissionGuardProps {
	children: ReactNode;
	requiredPermissions?: string[];
	requiredRoles?: string[];
	fallbackPath?: string;
	fallbackElement?: ReactNode;
}

export function PermissionGuard({
	children,
	// requiredPermissions = [],
	// requiredRoles = [],
	fallbackPath,
	fallbackElement,
}: PermissionGuardProps) {
	// 여기서 사용자의 권한/역할을 체크
	// 현재는 예시로 모든 접근을 허용
	const hasPermission = true;

	if (!hasPermission) {
		if (fallbackPath) {
			return <Navigate to={fallbackPath} replace />;
		}

		if (fallbackElement) {
			return <>{fallbackElement}</>;
		}

		return (
			<div className="min-h-[400px] flex flex-col items-center justify-center">
				<div className="text-center">
					<div className="text-6xl mb-4">🔒</div>
					<h2 className="text-2xl font-bold text-gray-700 mb-2">
						접근 권한이 없습니다
					</h2>
					<p className="text-gray-500">이 페이지에 접근할 권한이 없습니다.</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
