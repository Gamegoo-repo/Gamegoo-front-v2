import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { testLogin } from "@/features/auth/api/test-login";

export const Route = createFileRoute("/test-login")({
	component: TestLoginPage,
});

function TestLoginPage() {
	const navigation = useNavigate();
	const [memberId, setMemberId] = useState<number>(2);
	const [isLoading, setIsLoading] = useState(false);

	const handleTestLogin = async (id?: number) => {
		setIsLoading(true);
		try {
			const success = await testLogin(id || memberId);
			if (success) {
				// 메인 페이지로 이동
				navigation({ to: "/" });
			} else {
				alert("테스트 로그인 실패");
			}
		} catch (error) {
			console.error("Login error:", error);
			alert("로그인 중 오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	// 미리 설정된 테스트 계정들
	const testAccounts = [
		{ id: 2, name: "테스트 사용자 2" },
		{ id: 8, name: "테스트 사용자 8" },
		{ id: 10, name: "테스트 사용자 10" },
	];

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div className="bg-white p-8 rounded-lg shadow-md">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-700">
							개발용 테스트 로그인
						</h2>
						<p className="mt-2 text-sm text-gray-500">
							개발 편의를 위한 로그인 페이지입니다.
						</p>
					</div>

					<div className="space-y-6">
						{/* 빠른 선택 버튼들 */}
						<div>
							<span className="block text-sm font-medium text-gray-700 mb-2">
								빠른 로그인
							</span>
							<div className="grid grid-cols-1 gap-2">
								{testAccounts.map((account) => (
									<button
										type="button"
										key={account.id}
										onClick={() => handleTestLogin(account.id)}
										disabled={isLoading}
										className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										{account.name} (ID: {account.id})
									</button>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">또는</span>
							</div>
						</div>

						<div>
							<label
								htmlFor="memberId"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								커스텀 Member ID
							</label>
							<div className="flex gap-2">
								<input
									type="number"
									id="memberId"
									value={memberId}
									onChange={(e) => setMemberId(Number(e.target.value))}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
									placeholder="Member ID 입력"
									min="1"
								/>
								<button
									type="button"
									onClick={() => handleTestLogin()}
									disabled={isLoading || !memberId}
									className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isLoading ? "로그인 중..." : "로그인"}
								</button>
							</div>
						</div>

						{/* 콘솔 사용법 안내 */}
						<div className="bg-gray-100 rounded-md p-4">
							<h3 className="text-sm font-medium text-gray-700 mb-2">
								💡 콘솔에서 직접 사용하기
							</h3>
							<code className="text-xs bg-gray-800 text-green-400 p-2 rounded block overflow-x-auto">
								window.testLogin(2) {"// Member ID 2로 로그인"}
							</code>
						</div>

						{/* 경고 메시지 */}
						<div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
							<p className="text-sm text-yellow-800">
								⚠️ 이 기능은 개발 환경에서만 사용 가능합니다. 프로덕션에서는
								작동하지 않습니다.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
