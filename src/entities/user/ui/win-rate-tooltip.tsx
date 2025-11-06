import InfoIcon from "@/shared/assets/icons/ic-info.svg?react";
import Tooltip from "@/shared/ui/tooltip/tooltip";

export default function WinRateTooltip() {
	const content = (
		<div className="w-[255px] flex flex-col gap-3">
			<span className="semibold-18">현 시즌 성적 통계</span>
			<p className="flex-wrap break-words regular-14">
				선택한 게임 모드의 이번 시즌 승률을 보여줘요.
				<br />
				최대 30게임 승률(0~30게임)
			</p>
		</div>
	);
	return (
		<Tooltip arrowPosition="right" content={content}>
			<button type="button" className="shrink-0 cursor-pointer">
				<InfoIcon />
			</button>
		</Tooltip>
	);
}
