import { Link } from "@tanstack/react-router";
import { LogoButton } from "@/shared/ui/logo";
import { useId, useState } from "react";
import { Checkbox } from "@/shared/ui/checkbox/checkbox";

import RiotIcon from "@/shared/assets/icons/riot.svg?react";

export default function AuthPage() {
	const checkboxId = useId();
	const [isKeepAuthChecked, setIsKeepAuthChecked] = useState(false);
	return (
		<div className="w-screen h-screen flex items-center justify-center">
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

					<button
						type="button"
						onClick={() => console.log()}
						className="flex justify-center items-center w-full h-14 gap-2 bg-red-500 text-white rounded-[8px] mb-7"
					>
						<RiotIcon className="w-5" />
						{/* <img className="w-6" src={riotImage} alt="라이엇 아이콘"></img> */}
						<span className="font-bold text-base">
							라이엇 계정으로 시작하기
						</span>
					</button>

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
					<Link to="" className="font-medium text-base text-gray-800">
						<span>라이엇 계정 만들기</span>
					</Link>
				</footer>
			</div>
		</div>
	);
}
