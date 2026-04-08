import BackIcon from "@/shared/assets/icons/ic-arrow-back.svg?react";

interface Props {
	title?: string;
	/** `onBack`이 없으면 뒤로가기 버튼을 노출하지 않는다 (half 상태) */
	onBack?: () => void;
}

export function BottomSheetHeader({ onBack, title }: Props) {
	return (
		<header className="flex font-bold text-gray-800 text-lg">
			<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
				{onBack && (
					<button type="button" className="cursor-pointer" onClick={onBack}>
						<BackIcon className="w-5" />
					</button>
				)}
				<h2 className="whitespace-nowrap">{title}</h2>
			</div>
		</header>
	);
}
