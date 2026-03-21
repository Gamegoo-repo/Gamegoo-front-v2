import { useEffect, useState } from "react";
import useSNSShare from "../../model/use-sns-share";
import LolBtiShareModal from "./lolbti-share-modal";
import { LOL_BTI_TYPE_DATA, type LolBtiResultType } from "../../config";
import DownloadIcon from "@/shared/assets/icons/ic-download.svg?react";
import CopyLinkIcon from "@/shared/assets/icons/ic-copy-link.svg?react";
import KakaoShareImg from "@/shared/assets/images/kakao-share.png";
import { downloadLolBtiResult } from "../../lib/download-lolbti-result";
import { copyTextToClipboard } from "@/shared/lib/copy-riot-id";
import XLogoIcon from "@/shared/assets/icons/ic-x-logo.svg?react";
import { trackRollBtiEvent } from "../../api";
import { getEventSource } from "@/shared/lib/get-device";

export default function LolBtiShareButton({
	result,
}: {
	result: LolBtiResultType;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const shareUrl = window.location.href;

	const typeData = LOL_BTI_TYPE_DATA[result];

	const { shareToKakaoTalk, shareToX } = useSNSShare({
		title: `나의 롤BTI는 ${result} - ${typeData.title}`,
		description: typeData.quote,
		url: shareUrl,
		imageUrl: `/assets/images/result-cards/${result}.png`,
	});

	useEffect(() => {
		const img = new Image();
		img.src = `/assets/images/result-cards/${result}.png`;
	}, [result]);

	const handleShare = () => {
		setIsOpen(true);
	};

	const handleDownload = async () => {
		if (isDownloading) return;
		setIsDownloading(true);
		try {
			await downloadLolBtiResult(result);
		} finally {
			setIsDownloading(false);
		}

		trackRollBtiEvent({
			eventType: "RESULT_CARD_SAVE",
			sessionId: "",
			eventSource: getEventSource(),
		});
	};

	return (
		<>
			<LolBtiShareModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				result={result}
			>
				<div className="flex flex-col gap-1.5">
					<button
						type="button"
						onClick={handleDownload}
						disabled={isDownloading}
						className="flex aspect-square size-12 cursor-pointer items-center justify-center rounded-full bg-gray-700 p-3 disabled:opacity-50"
					>
						<DownloadIcon />
					</button>
					<span className="text-center text-white text-xs">
						{isDownloading ? "저장 중..." : "다운로드"}
					</span>
				</div>
				<div className="flex flex-col gap-1.5">
					<button
						type="button"
						onClick={() => copyTextToClipboard("https://www.gamegoo.co.kr")}
						className="flex aspect-square size-12 cursor-pointer items-center justify-center rounded-full bg-gray-700 p-3"
					>
						<CopyLinkIcon />
					</button>
					<span className="text-center text-white text-xs">URL 복사</span>
				</div>

				<div className="flex flex-col gap-1.5">
					<button
						type="button"
						onClick={shareToKakaoTalk}
						className="flex aspect-square size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F9E000] p-[5px]"
					>
						<img
							alt="카카오톡 공유"
							src={KakaoShareImg}
							className="h-full w-full"
						/>
					</button>
					<span className="text-center text-white text-xs">카카오톡</span>
				</div>

				<div className="flex flex-col gap-1.5">
					<button
						type="button"
						onClick={shareToX}
						className="flex aspect-square size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black p-3"
					>
						<XLogoIcon />
					</button>
					<span className="text-center text-white text-xs">X</span>
				</div>
			</LolBtiShareModal>
			<button
				type="button"
				onClick={handleShare}
				className="w-full cursor-pointer text-[#ccc] text-sm transition-all duration-300 hover:text-gray-300 hover:underline hover:underline-offset-4"
			>
				결과 공유하기
			</button>
		</>
	);
}
