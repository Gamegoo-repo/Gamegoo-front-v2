import RiotIcon from "@/shared/assets/icons/riot.svg?react";

function LoginButton({ onHandleLogin }: { onHandleLogin: () => void }) {
	return (
		<button
			type="button"
			onClick={onHandleLogin}
			className="mb-5 mobile:mb-7 flex w-full cursor-pointer items-center justify-center gap-2 mobile:rounded-[8px] rounded-[6px] bg-red-500 mobile:py-4 py-3 text-white"
		>
			<RiotIcon className="h-4 mobile:h-5 mobile:w-5 w-4" />
			<span className="font-semibold mobile:font-bold mobile:text-base text-sm">
				라이엇 계정으로 시작하기
			</span>
		</button>
	);
}

export default LoginButton;
