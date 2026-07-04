import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import z from 'zod';

import { TERMS } from '@/entities/term/model';
import LoadingSpinner from '@/shared/ui/loading-spinner/loading-spinner';

const termSearchSchema = z.object({
  term: z.enum(['privacy', 'service']),
});

export const Route = createFileRoute('/_header-layout/policy/')({
  component: RouteComponent,
  validateSearch: termSearchSchema,
  onError: () => {
    throw notFound({ routeId: '__root__' });
  },
});

const termComponents = {
  service: lazy(() => import('@/entities/term/ui/service-term-content')),
  marketing: lazy(() => import('@/entities/term/ui/marketing-term-content')),
  privacy: lazy(() => import('@/entities/term/ui/privacy-term-content')),
} as const;

function RouteComponent() {
  const { term } = Route.useSearch();

  const { label } = TERMS.find((t) => t.key === term) ?? {};

  const TermContent = term ? termComponents[term] : null;

  return (
    <section className="flex h-full min-h-screen w-full flex-col items-center gap-5 px-5 pb-10 mobile:px-0 mobile:pt-[60px] mobile:pb-28">
      <header className="flex w-full flex-col items-center gap-4 mobile:gap-5">
        <h2 className="w-full border-b border-gray-400 pb-2 text-center text-lg font-bold text-gray-700 mobile:pb-2.5 mobile:text-2xl">
          겜구 약관 및 개인정보 보호
        </h2>
        <nav className="flex items-center">
          <Link
            to={'/policy'}
            search={{ term: 'service' }}
            className="border-1 border-gray-300 p-2 text-sm font-medium text-gray-800 transition-all duration-100 hover:border-gray-400 hover:text-gray-600 mobile:px-5 mobile:py-3 mobile:text-lg [&.active]:border-1 [&.active]:border-violet-600 [&.active]:text-violet-600 mobile:[&.active]:font-bold"
          >
            이용 약관
          </Link>
          <Link
            to={'/policy'}
            search={{ term: 'privacy' }}
            className="border-1 border-gray-300 p-2 text-sm font-medium text-gray-800 transition-all duration-100 hover:border-gray-400 hover:text-gray-600 mobile:px-5 mobile:py-3 mobile:text-lg [&.active]:border-1 [&.active]:border-violet-600 [&.active]:text-violet-600 mobile:[&.active]:font-bold"
          >
            개인 정보 처리 방침
          </Link>
        </nav>
      </header>

      <div className="flex w-full flex-1 flex-col gap-2 mobile:gap-5">
        <h3 className="flex w-full items-center gap-0.5 text-base font-bold text-gray-800 mobile:text-xl">
          {label}
          <span className={'inline-block text-violet-600'}>(필수)</span>
        </h3>

        <article className="flex w-full flex-1 flex-col overflow-y-auto rounded-xl bg-gray-200 px-[14px] py-[19px] text-sm break-keep text-gray-800 mobile:px-6 mobile:py-7 mobile:text-lg">
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            {TermContent && <TermContent />}
          </Suspense>
        </article>
      </div>
    </section>
  );
}
