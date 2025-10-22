import RiotIcon from "@/shared/assets/icons/riot.svg?react";

function LoginButton({ onHandleLogin }: { onHandleLogin: () => void }) {
	return (
		<button
			type="button"
			onClick={onHandleLogin}
			className="flex justify-center items-center w-full h-14 gap-2 bg-red-500 text-white rounded-[8px] mb-7 cursor-pointer"
		>
			<RiotIcon className="w-5" />
			{/* <img className="w-6" src={riotImage} alt="라이엇 아이콘"></img> */}
			<span className="font-bold text-base">라이엇 계정으로 시작하기</span>
		</button>
	);
}

export default LoginButton;