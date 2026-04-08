export const LOL_BTI_AXIS_CONFIG = {
	"A/F": {
		left: { name: "Aggressor", desc: "한타, 교전 적극 참여", color: "#ff6b9d" },
		right: {
			name: "Farmer",
			desc: "CS 챙기며 안정적 플레이",
			color: "#ff6b9d",
		},
	},
	"D/S": {
		left: { name: "Developer", desc: "CS, 킬 욕심", color: "#9b59b6" },
		right: { name: "Supportive", desc: "팀원에게 자원 양보", color: "#9b59b6" },
	},
	"C/T": {
		left: { name: "Carry", desc: "혼자 힘으로 압도", color: "#2ecc71" },
		right: { name: "Teammate", desc: "팀원과 함께", color: "#2ecc71" },
	},
	"I/B": {
		left: { name: "Initiator", desc: "먼저 진입", color: "#5a42ee" },
		right: { name: "Backliner", desc: "후반 진입", color: "#5a42ee" },
	},
} as const;

export type LolBtiAxisKey = keyof typeof LOL_BTI_AXIS_CONFIG;
