import RiotIcon from '@/shared/assets/icons/riot.svg?react';

function LoginButton({ onHandleLogin }: { onHandleLogin: () => void }) {
  return (
    <button
      type="button"
      onClick={onHandleLogin}
      className="mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[6px] bg-red-500 py-3 text-white mobile:mb-7 mobile:rounded-[8px] mobile:py-4"
    >
      <RiotIcon className="h-4 w-4 mobile:h-5 mobile:w-5" />
      <span className="text-sm font-semibold mobile:text-base mobile:font-bold">
        라이엇 계정으로 시작하기
      </span>
    </button>
  );
}

export default LoginButton;
