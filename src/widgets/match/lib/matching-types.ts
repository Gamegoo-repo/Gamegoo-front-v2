export interface MatchingRequest {
	matchingType: "BASIC" | "PRECISE";
	gameMode: string;
	threshold: number;
	mike: "AVAILABLE" | "UNAVAILABLE";
	mainP: string;
	subP: string;
	wantP: string[];
	gameStyleIdList: number[] | null;
}

export interface MatchingCountData {
	data: {
		tierCount: Record<string, number>;
		userCount: number;
	};
	event: string;
	timestamp: string;
}

export interface MatchingFoundData {
	data: {
		senderMatchingInfo?: {
			matchingUuid: string;
		};
		senderMatchingUuid?: string;
		opponent?: {
			gameName: string;
			tag: string;
			tier: string;
			mainP: string;
			subP: string;
		};
	};
	senderMatchingUuid?: string;
	opponent?: {
		gameName: string;
		tag: string;
		tier: string;
		mainP: string;
		subP: string;
	};
	event: string;
	timestamp: string;
}

export interface MatchingSuccessData {
	chatroomUuid: string;
	opponent: {
		gameName: string;
		tag: string;
		tier: string;
		mainP: string;
		subP: string;
	};
}
