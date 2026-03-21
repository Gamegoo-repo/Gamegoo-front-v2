// LolBTI 결과 유형 상수 (OpenAPI 자동 생성 불가로 직접 정의)
export const LOL_BTI_RESULT_TYPE_LIST = [
	"ADCI",
	"ADCB",
	"ADTI",
	"ADTB",
	"ASCI",
	"ASCB",
	"ASTI",
	"ASTB",
	"FDCI",
	"FDCB",
	"FDTI",
	"FDTB",
	"FSCI",
	"FSCB",
	"FSTI",
	"FSTB",
] as const;

export type LolBtiResultType = (typeof LOL_BTI_RESULT_TYPE_LIST)[number];
