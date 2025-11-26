interface ChatroomDateDividerProps {
	date: string;
}

const ChatroomDateDivider = ({ date }: ChatroomDateDividerProps) => {
	return (
		<p className="my-[10px] mx-auto text-center rounded-[14px] medium-11 text-gray-700 whitespace-nowrap">
			{date}
		</p>
	);
};

export default ChatroomDateDivider;
