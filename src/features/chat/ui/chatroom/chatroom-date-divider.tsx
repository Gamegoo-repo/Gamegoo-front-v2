interface ChatroomDateDividerProps {
	date: string;
}

const ChatroomDateDivider = ({ date }: ChatroomDateDividerProps) => {
	return (
		<div className="my-4 flex items-center justify-center">
			<div className="flex items-center">
				<div className="h-px w-8 bg-violet-300"></div>
				<span className="regular-11 mx-3 text-violet-400">{date}</span>
				<div className="h-px w-8 bg-violet-300"></div>
			</div>
		</div>
	);
};

export default ChatroomDateDivider;
