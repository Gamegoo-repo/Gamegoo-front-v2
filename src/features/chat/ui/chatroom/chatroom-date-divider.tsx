interface ChatroomDateDividerProps {
  date: string;
}

const ChatroomDateDivider = ({ date }: ChatroomDateDividerProps) => {
  return (
    <p className="medium-11 mx-auto my-[10px] rounded-[14px] text-center whitespace-nowrap text-gray-700">
      {date}
    </p>
  );
};

export default ChatroomDateDivider;
