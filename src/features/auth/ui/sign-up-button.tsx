import { useState } from "react";
import { api } from "@/shared/api";
import type { RiotJoinRequest } from "@/shared/api/@generated";
import { cn } from "@/shared/lib/utils";

function SignUpButton({
	isDisabled,
	isAgreed,
	puuid,
}: {
	isDisabled: boolean;
	isAgreed: boolean;
	puuid: string;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const handleClick = async () => {
		setIsLoading(true);

		try {
			const riotJoinRequestDto: RiotJoinRequest = {
				puuid: puuid,
				isAgree: isAgreed,
			};

			const response = await api.public.riot.joinByRSO(riotJoinRequestDto);

			return response.data;
		} catch (error) {
			console.error("RIOT 회원가입 실패:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<button
			type="button"
			disabled={isDisabled || isLoading}
			onClick={handleClick}
			className={cn(
				"medium-16 h-14 self-stretch mobile:rounded-xl rounded-md text-white transition-colors",
				isDisabled
					? "cursor-not-allowed bg-gray-300 text-gray-500"
					: "cursor-pointer bg-violet-600 hover:bg-violet-700",
			)}
		>
			다음
		</button>
	);
}

export default SignUpButton;
