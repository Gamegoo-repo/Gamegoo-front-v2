import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/lib/utils';

export default function CreatePostButton({
  className,
  ...props
}: ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'semibold-14 mobile:bold-14 h-full w-[104px] cursor-pointer rounded-[6px] bg-violet-600 px-5 py-2 whitespace-nowrap text-white transition-all duration-200 hover:bg-violet-700 active:scale-95 mobile:w-[248px] mobile:rounded-xl mobile:px-14 mobile:py-5',
        className
      )}
    >
      글 작성하기
    </button>
  );
}
