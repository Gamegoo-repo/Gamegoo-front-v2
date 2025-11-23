type ErrorMessage = Record<string, string>;

import { AUTH_ERROR_MESSAGES } from "./auth-error";
import { BAN_ERROR_MESSAGES } from "./ban-error";
import { BLOCK_ERROR_MESSAGES } from "./block-error";
import { BOARD_ERROR_MESSAGES } from "./board-error";
import { CHAT_ERROR_MESSAGES } from "./chat-error";
import { COMMON_ERROR_MESSAGES } from "./common-error";
import { EMAIL_ERROR_MESSAGES } from "./email-error";
import { FRIEND_ERROR_MESSAGES } from "./friend-error";
import { GAMESTYLE_ERROR_MESSAGES } from "./game-style-error";
import { GLOBAL_ERROR_MESSAGES } from "./global-error";
import { MANNER_ERROR_MESSAGES } from "./manner-error";
import { MATCH_ERROR_MESSAGES } from "./match-error";
import { MEMBER_ERROR_MESSAGES } from "./member-error";
import { NOTI_ERROR_MESSAGES } from "./noti-error";
import { REPORT_ERROR_MESSAGES } from "./report-error";
import { RIOT_ERROR_MESSAGES } from "./riot-error";

export const SERVER_ERROR_MESSAGES: ErrorMessage = {
	...AUTH_ERROR_MESSAGES,
	...MEMBER_ERROR_MESSAGES,
	...RIOT_ERROR_MESSAGES,
	...BOARD_ERROR_MESSAGES,
	...FRIEND_ERROR_MESSAGES,
	...CHAT_ERROR_MESSAGES,
	...MANNER_ERROR_MESSAGES,
	...BLOCK_ERROR_MESSAGES,
	...EMAIL_ERROR_MESSAGES,
	...MATCH_ERROR_MESSAGES,
	...NOTI_ERROR_MESSAGES,
	...REPORT_ERROR_MESSAGES,
	...BAN_ERROR_MESSAGES,
	...GAMESTYLE_ERROR_MESSAGES,
	...COMMON_ERROR_MESSAGES,
	...GLOBAL_ERROR_MESSAGES,
} as const;

export type ErrorCode = keyof typeof SERVER_ERROR_MESSAGES;
