import Modal from "@/shared/ui/modal/modal";
import { useTermsDetailModalStore } from "./use-terms-detail-modal-store";
import { TERMS } from "@/entities/term/model";

import { lazy, Suspense } from "react";
import { cn } from "@/shared/lib/utils";
import LoadingSpinner from "@/shared/ui/loading-spinner/loading-spinner";

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
			hasCloseButton
			isBackdropClosable
			className="mobile:w-[523px] rounded-[30px] bg-white mobile:px-9 mobile:py-8"
		>
			<section className="flex w-full flex-col gap-5">
				<h2 className="flex items-center gap-0.5 font-bold mobile:text-xl text-gray-800">
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
				<article className="modal-scrollbar-custom h-[669px] w-full overflow-y-scroll rounded-xl bg-gray-200 pt-[19px] pr-[14px] pl-[18px] text-gray-800 text-sm">
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
