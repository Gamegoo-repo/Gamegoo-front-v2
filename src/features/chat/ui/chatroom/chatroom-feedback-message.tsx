import SmileIcon from "@/shared/assets/icons/smile.svg?react";

const ChatroomFeedbackMessage = ({
	onEvaluate,
}: {
	onEvaluate: () => void;
}) => (
	<div className="my-[35px] mx-auto w-[338px]">
		<div className="flex flex-col items-center px-[40px] py-[16px] border border-violet-300 bg-violet-100 rounded-[13px]">
			<SmileIcon width={22} height={22} className="mb-[7px]" />
			<p className="regular-13 text-gray-800 mb-[5px]">매칭은 어떠셨나요?</p>
			<p className="regular-13 text-gray-800">상대방의 매너를 평가해주세요!</p>
			<button
				type="button"
				onClick={onEvaluate}
				className="w-[119px] h-[29px] rounded-full mt-[12px] semi-bold-13 bg-violet-600 text-white"
			>
				매너평가 하기
			</button>
		</div>
	</div>
);

export default ChatroomFeedbackMessage;
