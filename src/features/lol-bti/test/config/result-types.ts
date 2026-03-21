import type { LolPosition } from "./positions";
import {
	LOL_BTI_RESULT_TYPE_LIST,
	type LolBtiResultType,
} from "@/shared/lib/constants/lolbti-result-type";

// shared에서 import한 상수·타입 re-export
export { LOL_BTI_RESULT_TYPE_LIST, type LolBtiResultType };

interface ChampionInfo {
	name: string;
	championId: number;
}

interface LolBtiTypeData {
	title: string;
	description: string;
	imageIndex: number;
	positions: Partial<Record<LolPosition, ChampionInfo[]>>;
	strengths: string;
	weaknesses: string;
	quote: string;
}

export const LOL_BTI_COMPATIBILITY_MAP: Record<
	LolBtiResultType,
	{
		good: [LolBtiResultType, LolBtiResultType];
		bad: [LolBtiResultType, LolBtiResultType];
	}
> = {
	ADCI: { good: ["ADTB", "ASTI"], bad: ["FDCB", "FDTB"] },
	ADCB: { good: ["ASCI", "ASTB"], bad: ["FSTB", "FDTI"] },
	ADTI: { good: ["ASTI", "FSTI"], bad: ["FDCI", "FSCB"] },
	ADTB: { good: ["ADCI", "ASTB"], bad: ["FDCB", "FSTB"] },
	ASCI: { good: ["ADCB", "FSCI"], bad: ["FSCB", "FDTB"] },
	ASCB: { good: ["FDCB", "ASTB"], bad: ["ADCI", "FDTI"] },
	ASTI: { good: ["ADTI", "FSTI"], bad: ["ADCB", "FDCI"] },
	ASTB: { good: ["ADTB", "ASCB"], bad: ["FDCI", "FSCI"] },
	FDCI: { good: ["FDTI", "ASCI"], bad: ["ASTB", "FSTB"] },
	FDCB: { good: ["ASCB", "FSTB"], bad: ["ADCI", "ADTB"] },
	FDTI: { good: ["FDCI", "ADTI"], bad: ["ASCB", "FSTB"] },
	FDTB: { good: ["FSTB", "ASTB"], bad: ["ADCI", "ASCI"] },
	FSCI: { good: ["ASCI", "FSTI"], bad: ["ASTB", "FSCB"] },
	FSCB: { good: ["FDCB", "ASCB"], bad: ["ASCI", "ADTI"] },
	FSTI: { good: ["ADTI", "FSCI"], bad: ["FDCI", "ADCB"] },
	FSTB: { good: ["FDCB", "FSCB"], bad: ["ADCI", "ASCI"] },
};

export const LOL_BTI_TYPE_DATA: Record<LolBtiResultType, LolBtiTypeData> = {
	ADCI: {
		title: "단독 캐리형",
		description:
			"공격적인 교전으로 성장하고, 혼자 한타를 열어 팀을 캐리하는 것을 선호하는 유형",
		imageIndex: 1,
		quote: "내가 캐리하면 다 끝.",
		strengths: "강력한 개인 캐리력과 이니시에이팅 능력이 뛰어납니다.",
		weaknesses: "팀워크보다 개인 플레이에 집중하는 경향이 있습니다.",

		positions: {
			top: [
				{ name: "레넥톤", championId: 58 },
				{ name: "아트록스", championId: 266 },
			],
			jungle: [
				{ name: "리 신", championId: 64 },
				{ name: "바이", championId: 254 },
			],
			mid: [
				{ name: "탈론", championId: 91 },
				{ name: "제드", championId: 238 },
			],
			adc: [
				{ name: "드레이븐", championId: 119 },
				{ name: "칼리스타", championId: 429 },
			],
			support: [
				{ name: "레오나", championId: 89 },
				{ name: "알리스타", championId: 12 },
			],
		},
	},
	ADCB: {
		title: "돌격형 딜러",
		description:
			"공격적인 교전을 통해 자신의 성장을 극대화하고, 후방에서 홀로 게임을 끝내는 유형",
		imageIndex: 2,
		quote: "딜만 넣으면 이긴다.",
		strengths: "뛰어난 딜링 능력과 개인 캐리력이 강합니다.",
		weaknesses: "팀과의 연계보다 개인 플레이에 의존합니다.",
		positions: {
			top: [
				{ name: "제이스", championId: 126 },
				{ name: "퀸", championId: 133 },
			],
			jungle: [
				{ name: "비에고", championId: 234 },
				{ name: "그레이브즈", championId: 104 },
			],
			mid: [
				{ name: "신드라", championId: 134 },
				{ name: "아칼리", championId: 84 },
			],
			adc: [
				{ name: "루시안", championId: 236 },
				{ name: "사미라", championId: 360 },
			],
			support: [
				{ name: "브랜드", championId: 63 },
				{ name: "제라스", championId: 101 },
			],
		},
	},
	ADTI: {
		title: "교전 설계자",
		description:
			"자신의 성장을 우선시하지만, 팀을 위해 먼저 이니시를 열어 승리를 쟁취하는 유형",
		imageIndex: 3,
		quote: "성장해서 팀을 도와주겠다.",
		strengths: "균형잡힌 성장과 팀 기여도를 보입니다.",
		weaknesses: "개인 캐리와 팀플레이 사이에서 갈등할 수 있습니다.",
		positions: {
			top: [
				{ name: "판테온", championId: 80 },
				{ name: "다리우스", championId: 122 },
			],
			jungle: [
				{ name: "녹턴", championId: 56 },
				{ name: "카직스", championId: 121 },
			],
			mid: [
				{ name: "아리", championId: 103 },
				{ name: "오로라", championId: 893 },
			],
			adc: [
				{ name: "코그모", championId: 96 },
				{ name: "닐라", championId: 895 },
			],
			support: [
				{ name: "파이크", championId: 555 },
				{ name: "니코", championId: 518 },
			],
		},
	},
	ADTB: {
		title: "폭발적 협동가",
		description:
			"공격적 플레이로 성장하며, 팀원과 함께 후방에서 집중적인 딜을 쏟아붓는 유형",
		imageIndex: 4,
		quote: "팀과 함께 딜을 쏟아붓는다.",
		strengths: "강력한 딜링과 팀워크를 동시에 갖춘 플레이어입니다.",
		weaknesses: "전방 진입보다 후방 딜링에 의존합니다.",
		positions: {
			top: [
				{ name: "갱플랭크", championId: 41 },
				{ name: "트린다미어", championId: 23 },
			],
			jungle: [
				{ name: "마스터 이", championId: 11 },
				{ name: "벨베스", championId: 200 },
			],
			mid: [
				{ name: "카타리나", championId: 55 },
				{ name: "직스", championId: 115 },
			],
			adc: [
				{ name: "카이사", championId: 145 },
				{ name: "트리스타나", championId: 18 },
			],
			support: [
				{ name: "세라핀", championId: 147 },
				{ name: "자이라", championId: 143 },
			],
		},
	},
	ASCI: {
		// 진행중
		title: "숨은 영웅",
		description:
			"팀에게 자원을 양보하면서도 적극적으로 싸우고, 한타를 캐리하려는 유형",
		imageIndex: 5,
		quote: "숨어서 팀을 캐리한다.",
		strengths: "팀을 위한 희생과 개인 캐리력을 동시에 보입니다.",
		weaknesses: "자원 부족으로 인한 성장 지연이 있을 수 있습니다.",
		positions: {
			top: [
				{ name: "세트", championId: 875 },
				{ name: "뽀삐", championId: 78 },
			],
			jungle: [
				{ name: "자르반 4세", championId: 59 },
				{ name: "브라이어", championId: 233 },
			],
			mid: [
				{ name: "갈리오", championId: 3 },
				{ name: "말자하", championId: 90 },
			],
			support: [
				{ name: "쓰레쉬", championId: 412 },
				{ name: "라칸", championId: 497 },
			],
		},
	},
	ASCB: {
		title: "전략적 설계자",
		description:
			"팀에 헌신하며 이득을 주고, 후방에서 결정적인 스킬로 캐리 각을 만드는 유형",
		imageIndex: 6,
		quote: "한 방으로 게임을 뒤바꾼다.",
		strengths: "전략적 사고와 정확한 스킬 사용이 뛰어납니다.",
		weaknesses: "근접 전투보다 원거리 플레이에 의존합니다.",
		positions: {
			top: [
				{ name: "초가스", championId: 31 },
				{ name: "크산테", championId: 897 },
			],
			jungle: [
				{ name: "아이번", championId: 427 },
				{ name: "릴리아", championId: 876 },
			],
			mid: [
				{ name: "오리아나", championId: 61 },
				{ name: "라이즈", championId: 13 },
			],
			support: [
				{ name: "브랜드", championId: 63 },
				{ name: "흐웨이", championId: 910 },
			],
		},
	},
	ASTI: {
		title: "헌신적 방패",
		description:
			"팀을 위해 자원을 양보하며, 과감히 한타를 열어 팀의 승리를 이끄는 것을 즐기는 유형",
		imageIndex: 7,
		quote: "팀을 위해 몸을 던진다.",
		strengths: "팀을 위한 희생과 강력한 이니시에이팅 능력이 뛰어납니다.",
		weaknesses: "개인 성장보다 팀 기여에만 집중할 수 있습니다.",
		positions: {
			top: [
				{ name: "말파이트", championId: 54 },
				{ name: "마오카이", championId: 57 },
			],
			jungle: [
				{ name: "리 신", championId: 64 },
				{ name: "바이", championId: 254 },
			],
			mid: [
				{ name: "트위스티드 페이트", championId: 4 },
				{ name: "말파이트", championId: 54 },
			],
			support: [
				{ name: "알리스타", championId: 12 },
				{ name: "노틸러스", championId: 111 },
			],
		},
	},
	ASTB: {
		title: "전장의 조율자",
		description:
			"팀에게 자원을 양보하고 교전에 참여하며, 후방에서 팀 전체의 딜을 조율하는 유형",
		imageIndex: 8,
		quote: "팀의 딜을 조율한다.",
		strengths: "팀 전체의 딜을 조율하고 균형을 맞추는 능력이 뛰어납니다.",
		weaknesses: "개인 캐리력보다 팀 지원에만 의존할 수 있습니다.",
		positions: {
			top: [
				{ name: "리븐", championId: 92 },
				{ name: "나르", championId: 150 },
			],
			jungle: [
				{ name: "피들스틱", championId: 9 },
				{ name: "우디르", championId: 77 },
			],
			mid: [
				{ name: "흐웨이", championId: 910 },
				{ name: "조이", championId: 142 },
			],
			support: [
				{ name: "카르마", championId: 43 },
				{ name: "스웨인", championId: 50 },
			],
		},
	},
	FDCI: {
		title: "고독한 성장가",
		description:
			"초반엔 파밍에 집중하지만, 후반엔 혼자 한타를 열어 상대를 제압하는 것을 선호하는 유형",
		imageIndex: 9,
		quote: "시간은 내 편이다.",
		strengths: "안정적인 성장과 후반 캐리력이 뛰어납니다.",
		weaknesses: "초반 팀 기여도가 낮을 수 있습니다.",
		positions: {
			top: [
				{ name: "이렐리아", championId: 39 },
				{ name: "퀸", championId: 133 },
			],
			jungle: [
				{ name: "녹턴", championId: 56 },
				{ name: "쉬바나", championId: 102 },
			],
			mid: [
				{ name: "야스오", championId: 157 },
				{ name: "요네", championId: 777 },
			],
			adc: [
				{ name: "이즈리얼", championId: 81 },
				{ name: "코그모", championId: 96 },
			],
			support: [
				{ name: "럭스", championId: 99 },
				{ name: "피들스틱", championId: 9 },
			],
		},
	},
	FDCB: {
		title: "묵묵한 후방 캐리",
		description:
			"파밍에 집중하며 조용히 성장하고, 후반 한타에서 후방 포지션으로 압도적인 딜을 넣는 유형",
		imageIndex: 10,
		quote: "조용히 성장해서 후반에 터진다.",
		strengths: "안정적인 성장과 후반 딜링 능력이 뛰어납니다.",
		weaknesses: "초반 영향력이 낮고 팀 기여도가 부족할 수 있습니다.",
		positions: {
			top: [{ name: "케일", championId: 10 }],
			jungle: [
				{ name: "마스터 이", championId: 11 },
				{ name: "벨베스", championId: 200 },
			],
			mid: [
				{ name: "아우렐리온 솔", championId: 136 },
				{ name: "애니비아", championId: 34 },
			],
			adc: [
				{ name: "케이틀린", championId: 51 },
				{ name: "카이사", championId: 145 },
				{ name: "유나라", championId: 804 },
			],
			support: [
				{ name: "자이라", championId: 143 },
				{ name: "샤코", championId: 35 },
			],
		},
	},
	FDTI: {
		title: "고독한 이니시형",
		description:
			"초반에 파밍으로 성장하고, 한타에서 혼자 이니시를 걸어 팀에게 기회를 만들어 주는 유형",
		imageIndex: 11,
		quote: "성장해서 팀에게 기회를 만든다.",
		strengths:
			"안정적인 성장과 강력한 이니시에이팅 능력을 갖춘 플레이어입니다.",
		weaknesses: "초반 팀 기여도가 낮을 수 있습니다.",
		positions: {
			top: [
				{ name: "모데카이저", championId: 82 },
				{ name: "신지드", championId: 27 },
			],
			jungle: [
				{ name: "스카너", championId: 72 },
				{ name: "람머스", championId: 33 },
			],
			mid: [
				{ name: "벡스", championId: 711 },
				{ name: "럭스", championId: 99 },
			],
			adc: [
				{ name: "제리", championId: 221 },
				{ name: "트위치", championId: 29 },
			],
			support: [
				{ name: "렐", championId: 526 },
				{ name: "레나타 글라스크", championId: 888 },
			],
		},
	},
	FDTB: {
		title: "후반의 지배자",
		description:
			"파밍 위주로 성장하며, 후반에 팀과 함께 승리를 쟁취하는 데 기여하는 것을 즐기는 유형",
		imageIndex: 12,
		quote: "후반에 팀과 함께 승리한다.",
		strengths: "후반 캐리력과 팀워크를 동시에 갖춘 플레이어입니다.",
		weaknesses: "초반 영향력이 낮고 팀 기여도가 부족할 수 있습니다.",
		positions: {
			top: [
				{ name: "케일", championId: 10 },
				{ name: "나서스", championId: 75 },
			],
			jungle: [
				{ name: "킨드레드", championId: 203 },
				{ name: "카서스", championId: 30 },
			],
			mid: [
				{ name: "블라디미르", championId: 8 },
				{ name: "라이즈", championId: 13 },
			],
			adc: [
				{ name: "징크스", championId: 222 },
				{ name: "시비르", championId: 15 },
				{ name: "스몰더", championId: 901 },
			],
			support: [
				{ name: "세나", championId: 235 },
				{ name: "소나", championId: 37 },
			],
		},
	},
	FSCI: {
		title: "타이밍 지배자",
		description:
			"파밍으로 성장하고, 팀에게 자원을 양보하며, 결정적 이니시로 혼자서도 큰 영향력을 발휘하는 유형",
		imageIndex: 13,
		quote: "한 방으로 게임을 뒤바꾼다.",
		strengths: "안정적인 성장과 강력한 한방 이니시에이팅 능력이 뛰어납니다.",
		weaknesses: "초반 팀 기여도가 낮고 개인 캐리에만 의존할 수 있습니다.",
		positions: {
			top: [
				{ name: "암베사", championId: 799 },
				{ name: "잭스", championId: 24 },
			],
			jungle: [
				{ name: "아무무", championId: 32 },
				{ name: "아이번", championId: 427 },
			],
			mid: [{ name: "오리아나", championId: 61 }],
			support: [
				{ name: "블리츠크랭크", championId: 53 },
				{ name: "쓰레쉬", championId: 412 },
			],
		},
	},
	FSCB: {
		title: "숨어있는 딜러",
		description:
			"팀원에게 자원을 양보하며 성장하고, 한타 시 후방에서 팀을 캐리하는 것을 즐기는 유형",
		imageIndex: 14,
		quote: "숨어서 팀을 캐리한다.",
		strengths: "안정적인 성장과 후반 캐리력이 뛰어납니다.",
		weaknesses: "초반 영향력이 낮고 팀 기여도가 부족할 수 있습니다.",
		positions: {
			top: [
				{ name: "문도 박사", championId: 36 },
				{ name: "크산테", championId: 897 },
			],
			jungle: [
				{ name: "브랜드", championId: 63 },
				{ name: "킨드레드", championId: 203 },
			],
			mid: [
				{ name: "아크샨", championId: 166 },
				{ name: "신드라", championId: 134 },
			],
			support: [
				{ name: "자이라", championId: 143 },
				{ name: "벨코즈", championId: 161 },
			],
		},
	},
	FSTI: {
		title: "현명한 지휘관",
		description:
			"파밍을 통해 성장하고, 팀을 위해 이니시를 열어 함께 승리를 쟁취하는 것을 즐기는 유형",
		imageIndex: 15,
		quote: "전쟁은 머리로 하는 것.",
		strengths: "전략적 사고와 팀워크를 동시에 갖춘 플레이어입니다.",
		weaknesses: "초반 영향력이 낮을 수 있습니다.",
		positions: {
			top: [
				{ name: "케넨", championId: 85 },
				{ name: "다리우스", championId: 122 },
			],
			jungle: [
				{ name: "세주아니", championId: 113 },
				{ name: "릴리아", championId: 876 },
			],
			mid: [
				{ name: "사일러스", championId: 517 },
				{ name: "말자하", championId: 90 },
			],
			support: [
				{ name: "렐", championId: 526 },
				{ name: "모르가나", championId: 25 },
			],
		},
	},
	FSTB: {
		title: "헌신적 지원가",
		description:
			"자원을 팀에게 양보하며, 안정적으로 후방에서 아군을 도와주는 것을 가장 중요하게 생각하는 유형",
		imageIndex: 16,
		quote: "팀을 치유하는 것이 내 사명.",
		strengths: "팀 지원과 후방 안정성을 동시에 제공하는 플레이어입니다.",
		weaknesses: "개인 캐리력이 부족할 수 있습니다.",
		positions: {
			top: [
				{ name: "쉔", championId: 98 },
				{ name: "문도 박사", championId: 36 },
			],
			jungle: [
				{ name: "아이번", championId: 427 },
				{ name: "볼리베어", championId: 106 },
			],
			support: [
				{ name: "유미", championId: 350 },
				{ name: "브라움", championId: 201 },
				{ name: "질리언", championId: 26 },
			],
		},
	},
};
