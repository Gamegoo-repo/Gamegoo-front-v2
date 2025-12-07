interface ChatroomDateDividerProps {
	date: string;
}

const ChatroomDateDivider = ({ date }: ChatroomDateDividerProps) => {
	return (
		<p className="medium-11 mx-auto my-[10px] whitespace-nowrap rounded-[14px] text-center text-gray-700">
			{date}
		</p>
	);
};

export default ChatroomDateDivider;
