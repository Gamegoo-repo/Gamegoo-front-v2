export const formatDateSimple = (stringDate: string): string => {
	const postDate = new Date(stringDate);
	const now = new Date();

	// 밀리초 단위 차이
	const diffMs = now.getTime() - postDate.getTime();

	// 각 단위로 변환
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);

	// 가장 큰 단위부터 체크
	if (diffYears > 0) {
		return `${diffYears}년 전`;
	}

	if (diffMonths > 0) {
		return `${diffMonths}개월 전`;
	}

	if (diffDays > 0) {
		return `${diffDays}일 전`;
	}

	if (diffHours > 0) {
		return `${diffHours}시간 전`;
	}

	if (diffMinutes > 0) {
		return `${diffMinutes}분 전`;
	}

	if (diffSeconds > 0) {
		return `${diffSeconds}초 전`;
	}

	return "방금 전";
};
