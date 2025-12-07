import { createPortal } from "react-dom";
import PrecautionIcon from "@/shared/assets/icons/precaution.svg?react";
import { useLoginRequiredModalStore } from "../model/login-required-modal-store";

function LoginRequiredModal() {
	const { isOpen, closeModal } = useLoginRequiredModalStore();
	const modalRoot = document.getElementById("modal-root") || document.body;

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/62">
			<div className="absolute bottom-[28px] w-[640px] overflow-hidden">
				<div className="mb-2.5 flex flex-col items-center justify-center rounded-[17px] bg-white px-0 py-4 text-center">
					<div className="mb-4 h-12 w-12">
						<PrecautionIcon className="h-full w-full" />
					</div>
					<p className="bold-18 m-0 text-gray-700">
						로그인이 필요한 서비스입니다.
					</p>
				</div>
				<button
					type="button"
					className="w-full cursor-pointer rounded-[17px] bg-white py-4 text-center hover:bg-gray-50"
					onClick={closeModal}
				>
					<p className="regular-18 m-0 text-gray-700">확인</p>
				</button>
			</div>
		</div>,
		modalRoot,
	);
}

export default LoginRequiredModal;
