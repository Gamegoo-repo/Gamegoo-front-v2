import MannerLevelPopover from "@/entities/user/ui/manner-level-popover";
import type { MannerKeywordListResponse } from "@/shared/api";
import BubbleTooltip from "../user/bubble-tooltip";
import ProfileAvatar from "./profile-avatar";

interface MannerProfileAvatarProps {
	containerRef: React.RefObject<HTMLDivElement | null>;
	profileIndex: number;
	userMannerInfo: MannerKeywordListResponse;
	mannerLevel: number;
}

function MannerProfileAvatar({
	containerRef,
	userMannerInfo,
	mannerLevel,
	profileIndex,
}: MannerProfileAvatarProps) {
	return (
		<div ref={containerRef} className="relative shrink-0">
			<BubbleTooltip variant="lg" align="center" />
			<MannerLevelPopover
				containerRef={containerRef}
				userMannerInfo={userMannerInfo}
				userMannerLevel={mannerLevel}
			>
				<ProfileAvatar size="xl" profileIndex={profileIndex} />
				<div className="-translate-x-1/2 absolute bottom-[2px] left-1/2 inline-flex h-[25px] w-[49px] cursor-pointer items-center justify-center rounded-[57px] bg-black/65 px-[10px] py-[6px] opacity-100">
					<span className="bold-12 text-violet-300 leading-none">
						LV.{mannerLevel}
					</span>
				</div>
			</MannerLevelPopover>
		</div>
	);
}

export default MannerProfileAvatar;
