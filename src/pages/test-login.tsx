import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { testLogin } from '@/features/auth/api/test-login';

export const Route = createFileRoute('/test-login')({
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
        navigation({ to: '/' });
      } else {
        alert('테스트 로그인 실패');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 미리 설정된 테스트 계정들
  const testAccounts = [
    { id: 2, name: '테스트 사용자 2' },
    { id: 8, name: '테스트 사용자 8' },
    { id: 10, name: '테스트 사용자 10' },
  ];

  return (
    <div className="bg-gray-50 flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-700">개발용 테스트 로그인</h2>
            <p className="mt-2 text-sm text-gray-500">개발 편의를 위한 로그인 페이지입니다.</p>
          </div>

          <div className="space-y-6">
            {/* 빠른 선택 버튼들 */}
            <div>
              <span className="mb-2 block text-sm font-medium text-gray-700">빠른 로그인</span>
              <div className="grid grid-cols-1 gap-2">
                {testAccounts.map((account) => (
                  <button
                    type="button"
                    key={account.id}
                    onClick={() => handleTestLogin(account.id)}
                    disabled={isLoading}
                    className="hover:bg-gray-50 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <div>
              <label htmlFor="memberId" className="mb-2 block text-sm font-medium text-gray-700">
                커스텀 Member ID
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={memberId}
                  onChange={(e) => setMemberId(Number(e.target.value))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  placeholder="Member ID 입력"
                  min="1"
                />
                <button
                  type="button"
                  onClick={() => handleTestLogin()}
                  disabled={isLoading || !memberId}
                  className="rounded-md bg-violet-600 px-4 py-2 text-white transition-colors hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </div>
            </div>

            {/* 콘솔 사용법 안내 */}
            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">💡 콘솔에서 직접 사용하기</h3>
              <code className="block overflow-x-auto rounded bg-gray-800 p-2 text-xs text-green-400">
                window.testLogin(2) {'// Member ID 2로 로그인'}
              </code>
            </div>

            {/* 경고 메시지 */}
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ 이 기능은 개발 환경에서만 사용 가능합니다. 프로덕션에서는 작동하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
