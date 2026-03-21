import {
	LOL_BTI_AXIS_CONFIG,
	LOL_BTI_QUESTIONS,
	type LolBtiAxisKey,
	type LolBtiResultType,
} from "../config";

type AxisChar = "A" | "F" | "D" | "S" | "T" | "C" | "I" | "B";
type AxisScores = Record<AxisChar, number>;

const INITIAL_SCORES: AxisScores = {
	A: 0,
	F: 0,
	D: 0,
	S: 0,
	T: 0,
	C: 0,
	I: 0,
	B: 0,
};

/**
 * 답안 배열에서 각 성향 축의 점수를 집계
 * 각 질문의 axis[0]은 A 선택 시, axis[1]은 B 선택 시 증가할 축을 나타냄
 */
const collectAxisScores = (answers: ("A" | "B")[]): AxisScores => {
	return answers.reduce<AxisScores>(
		(scores, answer, index) => {
			const [aAxis, bAxis] = LOL_BTI_QUESTIONS[index].axis as [
				AxisChar,
				AxisChar,
			];
			const selected = answer === "A" ? aAxis : bAxis;
			scores[selected] += 1;
			return scores;
		},
		{ ...INITIAL_SCORES },
	);
};

/**
 * 12개의 답안을 기반으로 롤BTI 결과 유형을 산출
 *
 * 산출 방식:
 * - 1자리: A/F 축에서 더 많이 선택된 쪽
 * - 2자리: D/S 축에서 더 많이 선택된 쪽
 * - 3자리: C/T 축에서 더 많이 선택된 쪽
 * - 4자리: I/B 축에서 더 많이 선택된 쪽
 */
export const calculateLolBtiResult = (
	answers: ("A" | "B")[],
): LolBtiResultType => {
	const scores = collectAxisScores(answers);

	const resultType = [
		scores.A >= scores.F ? "A" : "F",
		scores.D >= scores.S ? "D" : "S",
		scores.C >= scores.T ? "C" : "T",
		scores.I >= scores.B ? "I" : "B",
	].join("") as LolBtiResultType;

	return resultType;
};

/**
 * 특정 축(axisKey)에서 왼쪽 성향(A, D, C, I)의 비율(%)을 반환
 *
 * @example
 * calculateAxisPercentage(answers, "A/F") → 67 (A 성향이 67%)
 */
export const calculateAxisPercentage = (
	answers: ("A" | "B")[],
	axisKey: LolBtiAxisKey,
): number => {
	const scores = collectAxisScores(answers);
	const [left, right] = axisKey.split("/") as [AxisChar, AxisChar];
	const total = scores[left] + scores[right];
	if (total === 0) {
		return 50;
	}
	return Math.round((scores[left] / total) * 100);
};

/**
 * 4개 축 전체의 비율을 한 번에 반환
 * LolBtiAxisResult 컴포넌트에 넘길 때 사용
 */
export const calculateAllAxisPercentages = (
	answers: ("A" | "B")[],
): Record<LolBtiAxisKey, number> => {
	const axisKeys = Object.keys(LOL_BTI_AXIS_CONFIG) as LolBtiAxisKey[];
	return Object.fromEntries(
		axisKeys.map((key) => [key, calculateAxisPercentage(answers, key)]),
	) as Record<LolBtiAxisKey, number>;
};

/**
 * 서버에 저장된 resultPayload를 컴포넌트가 사용하는 축 비율 형식으로 변환
 *
 * @param payload - 서버에서 반환한 resultPayload
 * @returns 컴포넌트에서 사용할 수 있는 축 비율 맵
 */
export const convertPayloadToAxisPercentages = (
	payload: Record<string, unknown>,
): Record<LolBtiAxisKey, number> => ({
	"A/F": Number(payload["A/F"] ?? 50),
	"D/S": Number(payload["D/S"] ?? 50),
	"C/T": Number(payload["C/T"] ?? 50),
	"I/B": Number(payload["I/B"] ?? 50),
});
