import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import BackIcon from "@/shared/assets/icons/ic-arrow-back.svg?react";
import type { UserRelationshipStatus } from "@/widgets/user-info/model/user-info.types";

const HEADER_CONFIG = {
	guest: {
		variant: "default" as const,
		description: "로그인 후 다른 플레이어들의 정보를 확인해 보세요!",
	},
	stranger: {
		variant: "default" as const,
		description: "",
	},
	friend: {
		variant: "default" as const,
		description: "",
	},
	blocked: {
		variant: "warning" as const,
		description: "차단된 사용자입니다",
	},
	deleted: {
		variant: "default" as const,
		description: "",
	},
	me: {
		variant: "default" as const,
		description: "",
	},
	"pending-sent": {
		variant: "default" as const,
		description: "",
	},
	"pending-received": {
		variant: "default" as const,
		description: "",
	},
} as const;

const variantStyles = {
	default: "text-gray-800",
	warning: "text-red-600",
} as const;

export default function UserProfileHeader({
	children,
	relationshipStatus,
}: {
	children?: ReactNode;
	relationshipStatus: UserRelationshipStatus;
}) {
	const router = useRouter();

	const handleGoBack = () => {
		router.history.back();
	};

	const config = HEADER_CONFIG[relationshipStatus];

	return (
		<h2 className="mb-2 tablet:mb-0 flex items-center gap-2.5 mobile:gap-3 font-bold mobile:text-[34px] text-gray-800 text-lg">
			<button type="button" className="cursor-pointer" onClick={handleGoBack}>
				<BackIcon className="mobile:w-10 w-5" />
			</button>
			{children}
			<p className={`font-normal text-[22px] ${variantStyles[config.variant]}`}>
				{config.description}
			</p>
		</h2>
	);
}
