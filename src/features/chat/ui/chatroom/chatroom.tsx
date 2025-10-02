import type { ChatMessage } from "@/entities/chat";
import ChatroomFeedbackMessage from "./chatroom-feedback-message";
import ChatroomMyMessage from "./chatroom-my-message";
import ChatroomOpponentMessage from "./chatroom-opponent-message";
import ChatroomSystemMessage from "./chatroom-system-message";

const Chatroom = () => {
	const message = {
		systemType: 5,
		message:
			"게시한 글222 afwjepofjpeoa  wopj opwajepo  fjapweo fpoawj e pojfapwo e jfpawo j epfoaw  pofjapowejf pawojef pawojepfo j apwo",
		boardId: 1,
		createdAt: "2025-01-01",
		senderId: 1,
		senderName: "테스트",
		senderProfileImg: 1,
	} as ChatMessage;

	const showTime = true;
	const showProfileImage = true;
	const isLast = true;
	const isMyMsgSent = true;
	const _handleMoveProfile = () => {};
	const _handleMannerEvaluate = () => {};
	const _handleDisplayDate = () => {};

	const chatEnterData = {
		memberId: 1,
		blind: false,
	};

	return (
		<div className="flex flex-col px-2 gap-2">
			<ChatroomSystemMessage message="게시한 글" href="/board/1" />
			<div>
				{/* {handleDisplayDate(messageList, index) && (
					<DateSeparator date={setChatDateFormatter(message.createdAt)} />
				)} */}

				{/* {message.systemType === 5 && ( */}
				<ChatroomFeedbackMessage onEvaluate={_handleMannerEvaluate} />
				{/* )} */}

				{message.systemType !== null &&
					message.systemType !== undefined &&
					message.systemType !== 5 && (
						<ChatroomSystemMessage
							message={message.message}
							href={`/board/${message.boardId}`}
						/>
					)}

				{message.senderId === chatEnterData.memberId && (
					<ChatroomOpponentMessage
						message={message}
						showTime={showTime}
						showProfileImage={showProfileImage}
					/>
				)}

				{/* {message.senderId !== chatEnterData.memberId &&
					message.senderId !== 0 && ( */}
				<ChatroomMyMessage
					message={message}
					showTime={showTime}
					isLast={isLast}
					isAnimated={isMyMsgSent}
				/>
				{/* )} */}
			</div>
		</div>
	);
};

export default Chatroom;
