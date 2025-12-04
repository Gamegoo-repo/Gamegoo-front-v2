import { useState } from "react";
import SmileIcon from "@/shared/assets/icons/smile.svg?react";
import Modal from "@/shared/ui/modal/modal";

type MannerType = "manner" | "badManner";

export default function MannerSelectModal({
	isOpen,
	onClose,
	onConfirm,
}: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (type: MannerType) => void;
}) {
	const [selected, setSelected] = useState<MannerType | null>(null);

	const handleConfirm = () => {
		if (!selected) return;
		onConfirm(selected);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className="w-[315px] p-0 bg-white rounded-[10px] overflow-hidden"
		>
			<div className="flex flex-col border-b border-gray-300">
				<button
					type="button"
					className="self-end p-3"
					onClick={onClose}
					aria-label="닫기"
				>
					<span className="sr-only">닫기</span>
				</button>
				<div className="flex items-center justify-evenly mb-4 px-2">
					<div
						className="flex flex-col items-center justify-center cursor-pointer select-none"
						onClick={() => setSelected("manner")}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") setSelected("manner");
						}}
					>
						<SmileIcon
							width={33}
							height={33}
							className={selected === "manner" ? "text-violet-600" : ""}
						/>
						<p className="regular-14 text-gray-800 mt-[11px]">매너 평가하기</p>
					</div>
					<div
						className="flex flex-col items-center justify-center cursor-pointer select-none"
						onClick={() => setSelected("badManner")}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") setSelected("badManner");
						}}
					>
						<SmileIcon
							width={33}
							height={33}
							className={
								selected === "badManner" ? "text-violet-600" : "opacity-50"
							}
						/>
						<p className="regular-14 text-gray-800 mt-[11px]">
							비매너 평가하기
						</p>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<button
					type="button"
					onClick={handleConfirm}
					disabled={!selected}
					className="flex-1 py-[30px] text-center bold-11 text-gray-600 disabled:text-gray-300 hover:text-violet-600 hover:bg-gray-100 rounded-b-[10px]"
				>
					확인
				</button>
			</div>
		</Modal>
	);
}
