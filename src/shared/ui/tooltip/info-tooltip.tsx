import InfoIcon from "@/shared/assets/icons/ic-info.svg?react";
import Tooltip from "@/shared/ui/tooltip/tooltip";

export default function InfoTooltip({
	title,
	content,
	className,
	buttonSize = 12,
}: {
	title: string;
	content: string;
	className?: string;
	buttonSize?: number;
}) {
	const innerContent = (
		<div className="flex flex-col gap-3">
			<span className="semibold-18">{title}</span>
			<p className="regular-14 flex-wrap break-words">{content}</p>
		</div>
	);
	return (
		<Tooltip
			arrowPosition="center"
			content={innerContent}
			className={className}
		>
			<button type="button" className="shrink-0 cursor-pointer">
				<InfoIcon width={buttonSize} height={buttonSize} />
			</button>
		</Tooltip>
	);
}
