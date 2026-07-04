import { getMannerText } from '@/entities/user/lib/get-manner-text';
import type { MannerKeywordResponse } from '@/shared/api';
import { cn } from '@/shared/lib/utils';

type MannerType = 'positive' | 'negative';

interface MannerKeywordsCardProps {
  title: string;
  keywords: MannerKeywordResponse[];
  type: MannerType;
  expand?: boolean;
}

export default function MannerKeywordsCard({
  title,
  keywords,
  type,
  expand = false,
}: MannerKeywordsCardProps) {
  return (
    <section className={cn('flex h-full w-full flex-col', expand && 'flex-1')}>
      <h3 className="mb-2 text-lg font-semibold text-gray-800 mobile:text-2xl mobile:font-normal">
        {title}
      </h3>
      <div
        className={cn(
          'flex-1 rounded-lg bg-gray-800 p-5 mobile:rounded-[20px] mobile:px-6 mobile:py-7',
          expand ? 'w-full' : 'tablet:w-[221px]'
        )}
      >
        <ul className="flex h-full w-full flex-col justify-between gap-1.5 mobile:gap-4">
          {keywords.map((mannerKeyword) => (
            <li
              key={mannerKeyword.mannerKeywordId}
              className={cn(
                'flex w-full items-center justify-between text-sm font-medium text-white mobile:text-base',
                mannerKeyword.count === 0 && 'text-gray-500'
              )}
            >
              {getMannerText(mannerKeyword.mannerKeywordId)}
              <span
                className={cn(
                  'font-bold',
                  mannerKeyword.count > 0 && type === 'positive' && 'text-violet-500',
                  mannerKeyword.count > 0 && type === 'negative' && 'text-red-500'
                )}
              >
                {mannerKeyword.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
