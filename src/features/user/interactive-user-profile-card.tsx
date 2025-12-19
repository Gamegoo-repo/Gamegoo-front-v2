import type { RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { useFetchMannerKeywords } from "@/entities/user/api/use-fetch-manner-keywords";
import MannerLevelPopover from "@/entities/user/ui/manner-level-popover";
import UserProfile from "@/entities/user/ui/user-profile";
import type { Mike } from "@/shared/api";
import MikeTag from "@/shared/ui/mike-tag";
import BubbleTooltip from "./bubble-tooltip";

export default function InteractiveUserProfileCard({
	modalRef,
	profileImage,
	gameName,
	tag,
	level,
	mike,
	memberId,
	onNavigate,
}: {
	modalRef: RefObject<HTMLDivElement | null>;
	profileImage: number;
	gameName: string;
	tag: string;
	level: number;
	mike: Mike;
	memberId: number;
	onNavigate?: () => void;
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
		<div className="flex items-center gap-3">
			<p className="relative">
				<BubbleTooltip variant="sm" align="right" />
				<Link
					to={"/users/$userId"}
					params={{ userId: memberId.toString() }}
					onClick={onNavigate}
				>
					<UserProfile
						id={profileImage}
						sizeClass="w-[74px] h-[74px]"
						hasDropShadow
					/>
				</Link>
				<MannerLevelPopover
					userMannerLevel={level}
					containerRef={modalRef}
					userMannerInfo={userMannerInfo}
				>
					<span className="-translate-x-1/2 bold-12 absolute bottom-0 left-1/2 inline-block translate-y-1/3 cursor-pointer rounded-full bg-black/65 px-2 py-0.5 text-violet-300">
						LV.{level}
					</span>
				</MannerLevelPopover>
			</p>
			<p className="flex h-fit flex-col gap-1">
				<span className="bold-20 flex w-full items-center justify-start gap-1.5 text-gray-800">
					{gameName}
					{mike && <MikeTag isMikeAvailable={mike === "AVAILABLE"} />}
				</span>
				<span className="semibold-14 text-gray-500">#{tag}</span>
			</p>
		</div>
	);
}
