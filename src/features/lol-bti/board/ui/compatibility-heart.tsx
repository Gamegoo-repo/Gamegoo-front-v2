import EmptyHeartIcon from "@/shared/assets/icons/ic-empty-heart.svg?react";
import FullHeartIcon from "@/shared/assets/icons/ic-full-heart.svg?react";
import HalfHeartIcon from "@/shared/assets/icons/ic-half-heart.svg?react";

export default function CompatibilityHeart({
	compatibilityLevel,
}: {
	compatibilityLevel: "full" | "half" | "empty";
}) {
	let Icon = FullHeartIcon;
	switch (compatibilityLevel) {
		case "half":
			Icon = HalfHeartIcon;
			break;
		case "empty":
			Icon = EmptyHeartIcon;
			break;
	}
	return (
		<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0px_0px_21px_0px_rgba(0,0,0,0.15)]">
			<Icon />
		</div>
	);
}
