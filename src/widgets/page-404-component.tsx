import { useRouter } from '@tanstack/react-router';

export default function Page404Component() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };
  return (
    <div className="flex h-screen w-screen">
      <section className="my-auto ml-auto flex flex-col items-center mobile:mt-[315px] mobile:mb-0 mobile:ml-[251px] mobile:items-start">
        <img
          alt={'404 에러'}
          src={'/assets/icons/404-error.svg'}
          className="w-[80%] pb-2 mobile:w-[388px] mobile:pb-3"
        />
        <h2 className="text-2xl font-bold text-gray-700 mobile:text-[32px]">Page not found</h2>

        <button
          type="button"
          onClick={handleGoBack}
          className="medium-16 mt-[110px] cursor-pointer rounded-2xl border border-violet-600 bg-violet-100 px-20 py-4 text-gray-800"
        >
          뒤로가기
        </button>
      </section>
    </div>
  );
}
