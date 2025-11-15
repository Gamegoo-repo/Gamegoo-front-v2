import type { RefObject } from "react";
import MikeTag from "@/shared/ui/mike-tag";
import { useFetchMannerKeywords } from "@/entities/user/api/use-fetch-manner-keywords";
import MannerLevelPopover from "@/entities/user/ui/manner-level-popover";
import UserProfile from "@/entities/user/ui/user-profile";
import type { Mike } from "@/shared/api";
import BubbleTooltip from "./bubble-tooltip";

export default function InteractiveUserProfileCard({
	modalRef,
	profileImage,
	gameName,
	tag,
	level,
	mike,
	memberId,
}: {
	modalRef: RefObject<HTMLDivElement | null>;
	profileImage: number;
	gameName: string;
	tag: string;
	level: number;
	mike: Mike;
	memberId: number;
}) {
	const {
		data: userMannerInfo,
		isError,
		error,
		isFetching,
	} = useFetchMannerKeywords(memberId);

	if (isFetching) {
		return null;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (!userMannerInfo) {
		return null;
	}
	return (
		<div className="flex gap-3 items-center">
			<p className="relative">
				<BubbleTooltip />
				<UserProfile id={profileImage} size={74} hasDropShadow />
				<MannerLevelPopover
					containerRef={modalRef}
					userMannerInfo={userMannerInfo}
				>
					<span className="cursor-pointer inline-block py-0.5 px-2 rounded-full text-violet-300 bg-black/65 absolute left-1/2 bottom-0 -translate-x-1/2 bold-12 translate-y-1/3">
						LV.{level}
					</span>
				</MannerLevelPopover>
			</p>
			<p className="flex flex-col h-fit gap-1">
				<span className="flex items-center justify-start gap-1.5 text-gray-800 bold-20 w-full">
					{gameName}
					{mike && <MikeTag isMikeAvailable={mike === "AVAILABLE"} />}
				</span>
				<span className="text-gray-500 semibold-14">#{tag}</span>
			</p>
		</div>
	);
}
