import { createPortal } from "react-dom";
import PrecautionIcon from "@/shared/assets/icons/precaution.svg?react";
import { useLoginRequiredModalStore } from "../model/login-required-modal-store";

function LoginRequiredModal() {
	const { isOpen, closeModal } = useLoginRequiredModalStore();
	const modalRoot = document.getElementById("modal-root") || document.body;

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/62">
			<div className="absolute bottom-[28px] mobile:w-[640px] w-[90%] overflow-hidden">
				<div className="mb-2 mobile:mb-3 flex flex-col items-center justify-center mobile:rounded-[18px] rounded-[14px] bg-white px-0 py-5 text-center font-bold mobile:text-lg text-base">
					<div className="mobile:mb-4 h-12 mobile:h-[72px] mobile:w-[72px] w-12">
						<PrecautionIcon className="h-full w-full" />
					</div>
					<p className="m-0 text-gray-900">로그인이 필요한 서비스입니다.</p>
				</div>
				<button
					type="button"
					className="w-full cursor-pointer mobile:rounded-[18px] rounded-[14px] bg-white mobile:py-4 py-3 text-center font-bold mobile:text-lg text-base text-gray-900 hover:bg-gray-50"
					onClick={closeModal}
				>
					확인
				</button>
			</div>
		</div>,
		modalRoot,
	);
}

export default LoginRequiredModal;
