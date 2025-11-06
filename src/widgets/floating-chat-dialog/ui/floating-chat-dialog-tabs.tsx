import {
	CHAT_DIALOG_TABS,
	type ChatDialogType,
	useChatDialogStore,
} from "@/entities/chat";

const TYPES_WITHOUT_TAB = ["chatroom"];

const TABS = CHAT_DIALOG_TABS.filter((tab) => !TYPES_WITHOUT_TAB.includes(tab));

const TAB_NAMES: Partial<Record<ChatDialogType, string>> = {
	"friend-list": "친구 목록",
	"chatroom-list": "채팅방",
};

function FloatingChatDialogTabs() {
	const { setChatDialogType, chatDialogType } = useChatDialogStore();

	const handleTabClick = (tab: ChatDialogType) => {
		setChatDialogType(tab);
	};

	if (TYPES_WITHOUT_TAB.includes(chatDialogType)) {
		return null;
	}

	return (
		<div className="flex px-[30px] gap-[40px] shadow-[0_2px_5px_-2px_rgba(0,0,0,0.15)] border-b border-gray-200">
			{TABS.map((tab) => (
				<button
					key={`chat-tab-${tab}`}
					name={tab}
					type="button"
					onClick={() => handleTabClick(tab)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleTabClick(tab);
						}
					}}
					className={`relative py-1 text-center font-medium transition-colors bold-14 text-gray-800 after:content-[''] after:absolute after:left-1/2 after:-bottom-[2px] after:h-[4px] after:bg-violet-600 after:rounded-[60px] after:-translate-x-1/2 ${
						chatDialogType === tab ? "after:w-full" : "after:w-0"
					}`}
					role="tab"
				>
					{TAB_NAMES[tab] ?? tab}
				</button>
			))}
		</div>
	);
}

export default FloatingChatDialogTabs;
