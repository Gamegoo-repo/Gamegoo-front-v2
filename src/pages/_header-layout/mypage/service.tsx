import { createFileRoute } from "@tanstack/react-router";
import GmailIcon from "@/shared/assets/images/gmail.svg?react";
import KakaoIcon from "@/shared/assets/images/kakao.svg?react";

export const Route = createFileRoute("/_header-layout/mypage/service")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full w-full">
			<h2 className="bold-25 mb-4 border-gray-200 border-b pb-4">고객센터</h2>

			<div className="regular-18 mt-10 mb-10 flex flex-col items-center gap-2 text-center text-gray-800">
				<p>어떤 내용이든 문의해 주시면 답변 드리겠습니다!</p>
				<p>가능한 한 빠르게 도움을 드릴 수 있도록 노력하겠습니다.</p>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<a
					href="http://pf.kakao.com/_Rrxiqn"
					target="_blank"
					rel="noopener noreferrer"
					className="flex min-h-[248px] flex-col justify-between gap-6 rounded-[12px] bg-[#FFF7CC] p-[40px] transition hover:brightness-95"
				>
					<KakaoIcon className="h-[80px] w-[80px]" />
					<div className="flex flex-col gap-2">
						<div className="bold-25 text-gray-800">
							카카오톡 채널로 문의하기
						</div>
					</div>
				</a>

				<a
					href="https://mail.google.com/mail/?view=cm&fs=1&to=gamegoo0707@gmail.com"
					target="_blank"
					rel="noopener noreferrer"
					className="flex min-h-[248px] flex-col justify-between gap-6 rounded-[12px] bg-[#E9F0FF] p-[40px] transition hover:brightness-95"
				>
					<div className="flex h-[80px] w-[80px] items-center justify-center rounded-[16px] bg-white">
						<GmailIcon className="w-58px] h-[44px]" />
					</div>
					<div className="flex flex-col gap-2">
						<div className="bold-25 text-gray-800">이메일로 문의하기</div>
						<div className="text-gray-600">gamegoo0707@gmail.com</div>
					</div>
				</a>
			</div>
		</div>
	);
}
