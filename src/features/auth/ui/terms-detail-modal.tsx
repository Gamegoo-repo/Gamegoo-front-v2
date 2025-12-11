import Modal from "@/shared/ui/modal/modal";
import { useTermsDetailModalStore } from "./use-terms-detail-modal-store";
import { TERMS } from "@/entities/term/model";

import { lazy, Suspense } from "react";
import { cn } from "@/shared/lib/utils";
import LoadingSpinner from "@/shared/ui/loading-spinner/loading-spinner";
import CloseButton from "@/shared/ui/button/close-button";

const termComponents = {
	service: lazy(() => import("@/entities/term/ui/service-term-content")),
	marketing: lazy(() => import("@/entities/term/ui/marketing-term-content")),
	privacy: lazy(() => import("@/entities/term/ui/privacy-term-content")),
} as const;

export default function TermsDetailModal() {
	const { isOpen, closeModal, type } = useTermsDetailModalStore();

	const { label, required } = TERMS.find((term) => term.key === type) ?? {};

	const TermContent = type ? termComponents[type] : null;

	return (
		<Modal
			onClose={closeModal}
			isOpen={isOpen}
			hasCloseButton={false}
			isBackdropClosable
			className="h-full mobile:h-[785px] mobile:w-[523px] w-full mobile:rounded-[30px] rounded-lg bg-white p-5 mobile:px-9 mobile:py-8"
		>
			<section className="flex h-full w-full flex-col gap-2 mobile:gap-5">
				<div className="flex w-full items-center justify-between">
					<h2 className="flex items-center gap-0.5 font-bold mobile:text-xl text-base text-gray-800">
						{label}
						<span
							className={cn(
								"inline-block",
								required ? "text-violet-600" : "text-gray-500",
							)}
						>
							({required ? "필수" : "선택"})
						</span>
					</h2>

					<CloseButton
						className="p-0 hover:rounded-lg hover:bg-gray-300"
						onClose={closeModal}
					/>
				</div>

				<article className="modal-scrollbar-custom w-full flex-1 overflow-y-scroll rounded-xl bg-gray-200 pt-[19px] pr-[14px] pl-[18px] text-gray-800 text-sm">
					<Suspense
						fallback={
							<div className="flex h-full items-center justify-center">
								<LoadingSpinner />
							</div>
						}
					>
						{TermContent && <TermContent />}
					</Suspense>
				</article>
			</section>
		</Modal>
	);
}
