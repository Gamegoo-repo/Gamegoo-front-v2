import { cn } from "@/shared/lib/utils";
import { useSignUpMutation } from "../api/sign-up-mutation";

function SignUpButton({
	isDisabled,
	isAgreed,
	puuid,
}: {
	isDisabled: boolean;
	isAgreed: boolean;
	puuid: string;
}) {
	const { mutate: signUp, isPending } = useSignUpMutation();
	const handleSignUp = async () => {
		signUp({ puuid, isAgree: isAgreed });
	};
	return (
		<button
			type="button"
			disabled={isDisabled || isPending}
			onClick={handleSignUp}
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
