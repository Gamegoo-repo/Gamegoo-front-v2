import { useId, useState } from 'react';
import { LoginButton, login } from '@/features/auth';
import RightArrowIcon from '@/shared/assets/icons/arrow_right.svg?react';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import { LogoButton } from '@/shared/ui/logo';

export const AuthSection = () => {
  const checkboxId = useId();
  const [isKeepAuthChecked, setIsKeepAuthChecked] = useState(false);

  return (
    <div className="flex flex-col mobile:max-h-[559px] mobile:w-[374px] mobile:justify-between">
      <header className="mb-[72px] flex flex-col items-center mobile:mb-[92px]">
        <LogoButton className="mb-4 w-[280px] text-violet-600 mobile:w-[314px]" />
        <h1 className="sr-only">GAMEGOO</h1>
        <p className="text-center text-[13px] font-normal text-gray-500 mobile:text-base">
          GAMEGOO에 오신 것을 환영합니다.
        </p>
      </header>

      <main className="mb-1 flex flex-col">
        <h2 className="mb-9 text-center text-lg font-normal mobile:text-[25px]">
          서비스를 이용하려면
          <br />
          라이엇 계정으로 로그인하세요
        </h2>

        <LoginButton onHandleLogin={login} />

        <div className="mb-20 flex items-center justify-end gap-1.5">
          <Checkbox
            id={checkboxId}
            onCheckedChange={(checked) => setIsKeepAuthChecked(checked as boolean)}
            isChecked={isKeepAuthChecked}
          />
          <label
            htmlFor={checkboxId}
            className="cursor-pointer text-sm text-gray-700 mobile:text-base"
          >
            자동 로그인
          </label>
        </div>
      </main>
      <footer className="flex w-full flex-col items-center">
        <hr className="mb-5 w-full border-gray-300" />
        <a
          href="https://signup.kr.riotgames.com"
          className="flex items-center gap-1 text-base font-medium text-gray-800"
        >
          <span>라이엇 계정 만들기</span>
          <RightArrowIcon className="h-3.5 w-3.5" />
        </a>
      </footer>
    </div>
  );
};
