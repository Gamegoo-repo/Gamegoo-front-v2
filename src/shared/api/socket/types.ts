export enum SocketReadyState {
	CONNECTING = 0,
	OPEN = 1,
	CLOSING = 2,
	CLOSED = 3,
}

export const getSocketStateLabel = (state: SocketReadyState): string => {
	switch (state) {
		case SocketReadyState.CONNECTING:
			return "연결 중";
		case SocketReadyState.OPEN:
			return "연결됨";
		case SocketReadyState.CLOSING:
			return "연결 종료 중";
		case SocketReadyState.CLOSED:
			return "연결 끊어짐";
		default:
			return "알 수 없음";
	}
};
