import { Link } from "@tanstack/react-router";

interface SystemMessageProps {
	message: string;
	href?: string;
	onClickMessage?: () => void;
}

const ChatroomSystemMessage = ({
	message,
	href,
	onClickMessage,
}: SystemMessageProps) => {
	const highlightedText = "게시한 글";
	const parts = message.split(highlightedText);

	if (parts.length === 1) {
		return (
			<div className="regular-13 mb-[11px] w-full rounded-full bg-gray-700 p-[4px] text-center text-white">
				{message}
			</div>
		);
	}

	return (
		<div className="regular-13 mb-[11px] w-full rounded-full bg-gray-700 p-[4px] text-center text-white">
			{href ? (
				<Link to={href}>
					<span className="cursor-pointer underline">
						{`${parts[0]} ${highlightedText}`}
					</span>
				</Link>
			) : (
				// biome-ignore lint/a11y/useKeyWithClickEvents: span에 onClick 추가
				<span
					className="cursor-pointer underline"
					onClick={onClickMessage ? onClickMessage : () => {}}
				>
					{`${parts[0]} ${highlightedText}`}
				</span>
			)}
			{parts[1]}
		</div>
	);
};

export default ChatroomSystemMessage;
