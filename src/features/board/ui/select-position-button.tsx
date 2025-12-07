import PlusIcon from "@/shared/assets/icons/-plus.svg?react";

export default function SelectPositionButton() {
	return (
		<button
			type="button"
			className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-full bg-violet-100"
		>
			<PlusIcon />
		</button>
	);
}
