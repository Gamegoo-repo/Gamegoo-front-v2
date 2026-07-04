import type { ButtonHTMLAttributes } from 'react';
import HoistingIcon from '@/shared/assets/icons/ic-hoisting.svg?react';
import { useAuthenticatedAction } from '@/shared/hooks/use-authenticated-action';
import { cn } from '@/shared/lib/utils';
import { useBumpPost } from '../api/use-bump-post';

interface BumpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function BumpButton({ className, ...props }: BumpButtonProps) {
  const { mutate, isPending } = useBumpPost();

  const handleBumpPost = useAuthenticatedAction(mutate);

  return (
    <button
      type="button"
      disabled={isPending}
      className={cn(
        'flex cursor-pointer items-center justify-center',
        'transition-transform duration-200 ease-out',
        'mobile:h-10 mobile:gap-1 mobile:hover:-translate-y-1',
        'aspect-square h-full rounded-md bg-linear-to-tr from-violet-600 to-[#E02FC8] px-3 py-2 text-white',
        'p-0 mobile:h-fit mobile:w-fit mobile:bg-none',
        className
      )}
      {...props}
      onClick={() => handleBumpPost()}
    >
      <HoistingIcon className="h-3.5 w-3.5 text-white mobile:h-3 mobile:w-3 mobile:text-violet-600" />
      <span className="bold-14 hidden bg-gradient-to-r from-violet-600 to-[#E02FC8] break-keep mobile:block mobile:bg-clip-text mobile:text-transparent">
        내가 쓴 글 끌어올리기
      </span>
    </button>
  );
}
