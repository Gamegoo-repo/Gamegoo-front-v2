interface TabsProps {
	tabs: string[];
	activeTab: number;
	onTabClick: (index: number) => void;
}

function ChatTabs({ tabs, activeTab, onTabClick }: TabsProps) {
	return (
		<div className="flex border-b border-gray-200">
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
					className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
						activeTab === index
							? "text-violet-600 border-b-2 border-violet-600"
							: "text-gray-500 hover:text-gray-700"
					}`}
					role="tab"
				>
					{tab}
				</button>
			))}
		</div>
	);
}

export { ChatTabs };
