import { useRef, useState } from "react";
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
	const [selected, setSelected] = useState<MannerType>("manner");
	const contentRef = useRef<HTMLDivElement | null>(null);

	const handleConfirm = () => {
		if (!selected) return;
		onConfirm(selected);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			contentRef={contentRef}
			className="w-[315px] overflow-hidden rounded-[10px] bg-white p-0"
		>
			<div className="flex flex-col border-gray-300 border-b">
				<button
					type="button"
					className="self-end p-3"
					onClick={onClose}
					aria-label="닫기"
				>
					<span className="sr-only">닫기</span>
				</button>
				<div className="mb-4 flex items-center justify-evenly px-2">
					<div
						className="flex cursor-pointer select-none flex-col items-center justify-center"
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
						<p className="regular-14 mt-[11px] text-gray-800">매너 평가하기</p>
					</div>
					<div
						className="flex cursor-pointer select-none flex-col items-center justify-center"
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
						<p className="regular-14 mt-[11px] text-gray-800">
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
					className="bold-11 flex-1 rounded-b-[10px] py-[30px] text-center text-gray-600 hover:bg-gray-100 hover:text-violet-600 disabled:text-gray-300"
				>
					확인
				</button>
			</div>
		</Modal>
	);
}
