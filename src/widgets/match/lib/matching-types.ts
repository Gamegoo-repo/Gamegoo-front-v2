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
	tierCount: Record<string, number>;
	userCount: number;
}

export interface MatchingFoundData {
	senderMatchingUuid?: string;
	opponent?: {
		gameName: string;
		tag: string;
		tier: string;
		mainP: string;
		subP: string;
	};
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
