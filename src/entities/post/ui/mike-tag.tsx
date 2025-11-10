import MikeIcon from "@/shared/assets/icons/ic-mike.svg?react";

export default function MikeTag({
	isMikeAvailable,
}: {
	isMikeAvailable: boolean;
}) {
	return (
		<p
			className={`flex w-fit h-fit items-center justify-center gap-1 rounded-full px-3 py-0.5 border-2  semibold-13 ${isMikeAvailable ? "border-violet-600 text-violet-600" : "border-gray-600 text-gray-600"}`}
		>
			<MikeIcon className="h-fit" /> 마이크 {isMikeAvailable ? "ON" : "OFF"}
		</p>
	);
}
