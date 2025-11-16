import { useRouter } from "@tanstack/react-router";

export default function Page404Component() {
	const router = useRouter();

	const handleGoBack = () => {
		router.history.back();
	};
	return (
		<div className="flex w-screen h-screen">
			<section className="flex flex-col items-center mobile:items-start ml-auto mobile:ml-[251px] my-auto mobile:mt-[315px] mobile:mb-0">
				<img
					alt={"404 에러"}
					src={"/assets/icons/404-error.svg"}
					className="w-[80%] mobile:w-[388px] pb-2 mobile:pb-3"
				/>
				<h2 className="font-bold text-2xl mobile:text-[32px] text-gray-700">
					Page not found
				</h2>

				<button
					type="button"
					onClick={handleGoBack}
					className="mt-[110px] bg-violet-100 border border-violet-600 px-20 py-4 text-gray-800 medium-16 rounded-2xl cursor-pointer"
				>
					뒤로가기
				</button>
			</section>
		</div>
	);
}
