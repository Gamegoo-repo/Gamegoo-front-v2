export const AUTH_ERROR_MESSAGES = {
	AUTH_403: "JWT 서명이 유효하지 않습니다.",
	AUTH_404: "JWT의 형식이 올바르지 않습니다.",
	AUTH_405: "지원되지 않는 JWT입니다.",
	AUTH_406: "기존 토큰이 만료되었습니다. 토큰을 재발급해주세요.",
	AUTH_407: "JWT의 클레임이 유효하지 않습니다.",
	AUTH_409: "사용할 수 없는 리프레쉬 토큰입니다.",
	AUTH_410: "로그인 후 이용가능합니다.",
	AUTH_412: "탈퇴한 사용자 입니다.",
} as const;
