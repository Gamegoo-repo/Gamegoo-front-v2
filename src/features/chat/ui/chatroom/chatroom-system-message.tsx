import { Link } from "@tanstack/react-router";

interface SystemMessageProps {
	message: string;
	href?: string;
}

const ChatroomSystemMessage = ({ message, href }: SystemMessageProps) => {
	const highlightedText = "게시한 글";
	const parts = message.split(highlightedText);

	if (parts.length === 1) {
		return (
			<div className="w-full text-center p-[4px] mb-[11px] bg-gray-700 regular-13 text-white rounded-full">
				{message}
			</div>
		);
	}

	return (
		<div className="w-full text-center p-[4px] mb-[11px] bg-gray-700 regular-13 text-white rounded-full">
			{href ? (
				<Link to={href}>
					<span className="underline cursor-pointer">
						{`${parts[0]} ${highlightedText}`}
					</span>
				</Link>
			) : (
				<span className="underline cursor-pointer">
					{`${parts[0]} ${highlightedText}`}
				</span>
			)}
			{parts[1]}
		</div>
	);
};

export default ChatroomSystemMessage;
