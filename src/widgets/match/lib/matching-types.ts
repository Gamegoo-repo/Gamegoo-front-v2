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

export type GameMode = "FAST" | "SOLO" | "FREE" | "ARAM";
export type MikeStatus = "AVAILABLE" | "UNAVAILABLE";

export interface GameStyleItem {
	gameStyleId: number;
	gameStyleName: string;
}

export interface OpponentProfilePayload {
	memberId: number;
	matchingUuid: string;
	gameName: string;
	tag: string;
	soloTier: string;
	soloRank: number;
	freeTier: string;
	freeRank: number;
	mannerLevel: number;
	profileImg: number;
	gameMode: GameMode;
	mainP: string;
	subP: string;
	wantP: string[];
	mike: MikeStatus;
	gameStyleResponseList: GameStyleItem[];
}

export interface MatchingFoundSenderEvent {
	event: "matching-found-sender";
	data: OpponentProfilePayload;
	timestamp: string;
}

export interface MatchingFoundReceiverEvent {
	event: "matching-found-receiver";
	data: {
		senderMatchingInfo: OpponentProfilePayload;
		receiverMatchingUuid: string;
	};
	timestamp: string;
}
