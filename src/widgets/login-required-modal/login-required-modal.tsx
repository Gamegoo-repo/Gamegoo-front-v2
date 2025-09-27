import { createPortal } from "react-dom";
import PrecautionIcon from "@/shared/assets/icons/precaution.svg?react";

interface LoginRequiredModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
	const modalRoot = document.getElementById("modal-root") || document.body;

	if (!isOpen) return null;

	return createPortal(
		<div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/62">
			<div className="absolute w-[640px] overflow-hidden bottom-[28px]">
				<div className="mb-2.5 flex flex-col items-center justify-center rounded-[17px] bg-white px-0 py-4 text-center">
					<div className="mb-4 h-12 w-12">
						<PrecautionIcon className="h-full w-full" />
					</div>
					<p className="m-0 bold-18 text-gray-700">
						로그인이 필요한 서비스입니다.
					</p>
				</div>
				<button
					type="button"
					className="w-full cursor-pointer rounded-[17px] bg-white py-4 text-center hover:bg-gray-50"
					onClick={onClose}
				>
					<p className="m-0 regular-18 text-gray-700">확인</p>
				</button>
			</div>
		</div>,
		modalRoot,
	);
}

export default LoginRequiredModal;
