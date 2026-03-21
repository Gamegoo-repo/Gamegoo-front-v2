const SESSION_ID_KEY = "rollbti_session_id";
const RESULT_TYPE_KEY = "rollbti_result_type";

export const SessionManager = {
	/**
	 * 현재 세션 ID를 반환한다. 없으면 새로 생성하여 저장 후 반환한다.
	 * 동일 세션 내에서 여러 번 호출해도 항상 같은 값을 반환한다 (idempotent).
	 */
	getOrCreateId: (): string => {
		let sessionId = sessionStorage.getItem(SESSION_ID_KEY);

		if (!sessionId) {
			sessionId = `sess_${crypto.randomUUID()}`;
			sessionStorage.setItem(SESSION_ID_KEY, sessionId);
		}

		return sessionId;
	},

	/**
	 * 세션 ID가 존재하면 반환하고, 없으면 null을 반환한다.
	 * side effect 없이 세션 존재 여부를 확인할 때 사용한다.
	 */
	peek: (): string | null => {
		return sessionStorage.getItem(SESSION_ID_KEY);
	},

	/**
	 * 새 테스트 시작 시 호출한다.
	 * 기존 세션을 파기하고 새 UUID를 발급하여 반환한다.
	 */
	reset: (): string => {
		const newSessionId = `sess_${crypto.randomUUID()}`;
		sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
		return newSessionId;
	},

	/** 롤BTI 결과 타입을 저장한다. 회원가입 완료 이벤트 전송 시 활용한다. */
	setResultType: (resultType: string): void => {
		sessionStorage.setItem(RESULT_TYPE_KEY, resultType);
	},

	/** 저장된 롤BTI 결과 타입을 반환한다. 없으면 null을 반환한다. */
	getResultType: (): string | null => {
		return sessionStorage.getItem(RESULT_TYPE_KEY);
	},

	/** 세션 ID와 결과 타입을 모두 제거한다. 이벤트 소비 완료 후 호출한다. */
	clearAll: (): void => {
		sessionStorage.removeItem(SESSION_ID_KEY);
		sessionStorage.removeItem(RESULT_TYPE_KEY);
	},
};
