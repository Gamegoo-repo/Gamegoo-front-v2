interface TabsProps {
	tabs: string[];
	activeTab: number;
	onTabClick: (index: number) => void;
}

function ChatTabs({ tabs, activeTab, onTabClick }: TabsProps) {
	return (
		<div className="flex px-[30px] gap-[40px] shadow-[0_2px_5px_-2px_rgba(0,0,0,0.15)] border-b border-gray-200">
			{tabs.map((tab, index) => (
				<button
					key={`chat-tab-${tab}`}
					type="button"
					onClick={() => onTabClick(index)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onTabClick(index);
						}
					}}
					className={`relative py-1 text-center font-medium transition-colors bold-14 text-gray-800 after:content-[''] after:absolute after:left-1/2 after:-bottom-[2px] after:h-[4px] after:bg-violet-600 after:rounded-[60px] after:-translate-x-1/2 ${
						activeTab === index ? "after:w-full" : "after:w-0"
					}`}
					role="tab"
				>
					{tab}
				</button>
			))}
		</div>
	);
}

export default ChatTabs;
