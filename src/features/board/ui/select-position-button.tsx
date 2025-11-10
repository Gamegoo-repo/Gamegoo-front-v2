import PlusIcon from "@/shared/assets/icons/-plus.svg?react";

export default function SelectPositionButton() {
	return (
		<button
			type="button"
			className="bg-violet-100 h-8 w-12 rounded-full cursor-pointer flex items-center justify-center"
		>
			<PlusIcon />
		</button>
	);
}
