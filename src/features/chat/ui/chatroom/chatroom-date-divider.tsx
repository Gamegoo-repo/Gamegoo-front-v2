interface ChatroomDateDividerProps {
	date: string;
}

const ChatroomDateDivider = ({ date }: ChatroomDateDividerProps) => {
	return (
		<div className="flex items-center justify-center my-4">
			<div className="flex items-center">
				<div className="w-8 h-px bg-violet-300"></div>
				<span className="mx-3 regular-11 text-violet-400">{date}</span>
				<div className="w-8 h-px bg-violet-300"></div>
			</div>
		</div>
	);
};

export default ChatroomDateDivider;
