export type UserRelationshipStatus =
	| "me" // 0. 나의 프로필
	| "stranger" // 1. 아무 관계도 아닌 타유저
	| "pending-sent" // 2. 내가 친구 신청을 보낸 타유저
	| "pending-received" // 3. 나에게 친구 신청을 보낸 타유저
	| "friend" // 4. 나와 친구인 타유저
	| "blocked" // 5. 내가 차단한 타유저
	| "deleted" // 6. 탈퇴한 유저
	| "guest"; // 비회원
