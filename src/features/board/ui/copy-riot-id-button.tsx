import type { MouseEvent } from "react";
import { copyRiotIdToClipboard } from "@/shared/lib/copy-riot-id";
import { toast } from "@/shared/lib/toast";

export default function CopyRiotIdButton({
	gameName,
	tag,
}: {
	gameName: string;
	tag: string;
}) {
	const handleCopyRiotId = async (
		gameName: string,
		tag: string,
		e: MouseEvent,
	) => {
		e.stopPropagation();
		const { ok } = await copyRiotIdToClipboard({ gameName, tag });
		if (ok) {
			toast.confirm("소환사명이 복사되었습니다.");
		} else {
			toast.error("복사 실패");
		}
	};

	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				handleCopyRiotId(gameName, tag, e);
			}}
			className="flex cursor-pointer items-center justify-center rounded-sm border border-gray-300 bg-gray-100 px-1 py-0 font-medium text-[11px] text-gray-600 leading-normal"
		>
			복사
		</button>
	);
}
