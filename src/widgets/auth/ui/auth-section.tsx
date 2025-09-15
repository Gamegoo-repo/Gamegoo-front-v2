import { useId, useState } from "react";
import { LoginButton } from "@/features/sign-in-user";
import { login } from "@/features/sign-in-user/api/login";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { LogoButton } from "@/shared/ui/logo";

export default function AuthSection() {
	const checkboxId = useId();
	const [_isKeepAuthChecked, _setIsKeepAuthCheckedd] = useState(false);

	return (
		<div className="w-[374px] max-h-[559px] flex flex-col justify-between">
			<header className="flex flex-col items-center mb-[92px]">
				<LogoButton className="mb-4 text-violet-600" />
				<h1 className="sr-only">GAMEGOO</h1>
				<p className="text-gray-500 text-base font-normal text-center">
					GAMEGOO에 오신 것을 환영합니다.
				</p>
			</header>

			<main className="flex flex-col mb-1">
				<h2 className="font-normal text-[25px] text-center mb-9">
					서비스를 이용하려면
					<br />
					라이엇 계정으로 로그인하세요
				</h2>

				<LoginButton onHandleLogin={login} />

				<div className="flex items-center gap-1 justify-end mb-20">
					<Checkbox id={checkboxId} />
					<label
						htmlFor={checkboxId}
						className="text-base font-normal text-gray-700 cursor-pointer"
					>
						자동 로그인
					</label>
				</div>
			</main>
			<footer className="w-full flex flex-col items-center">
				<hr className="w-full border-gray-300 mb-5" />
				<a
					href="https://signup.kr.riotgames.com"
					className="font-medium text-base text-gray-800"
				>
					<span>라이엇 계정 만들기</span>
				</a>
			</footer>
		</div>
	);
}
