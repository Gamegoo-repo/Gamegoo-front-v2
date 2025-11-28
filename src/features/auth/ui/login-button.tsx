import RiotIcon from "@/shared/assets/icons/riot.svg?react";

function LoginButton({ onHandleLogin }: { onHandleLogin: () => void }) {
	return (
		<button
			type="button"
			onClick={onHandleLogin}
			className="mb-7 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-red-500 text-white"
		>
			<RiotIcon className="w-5" />
			{/* <img className="w-6" src={riotImage} alt="라이엇 아이콘"></img> */}
			<span className="font-bold text-base">라이엇 계정으로 시작하기</span>
		</button>
	);
}

export default LoginButton;
