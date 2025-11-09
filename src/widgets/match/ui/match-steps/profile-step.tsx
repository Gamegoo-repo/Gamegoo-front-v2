import { ProfileAvatar } from "@/features/profile";
import type { MyProfileResponse } from "@/shared/api";
import { socketManager } from "@/shared/api/socket";
import { Button } from "@/shared/ui";
import type { UseMatchFunnelReturn } from "../../hooks";
import MatchHeader from "../match-header";

interface ProfileStepProps {
	funnel: UseMatchFunnelReturn;
	user: MyProfileResponse | null;
}

function ProfileStep({ funnel, user }: ProfileStepProps) {
	const handleMatchStart = () => {
		if (!socketManager.connected) {
			console.error("Socket is not connected.");
			return;
		}

		/**
		 * todo: gameStyleIdList 추가
		 */
		funnel.context.profile = {
			mike: user?.mike || undefined,
			mainP: user?.mainP || undefined,
			subP: user?.subP || undefined,
			wantP: user?.wantP || undefined,
			gameStyleResponseList: user?.gameStyleResponseList || undefined,
		};

		funnel.toStep("match-start");

	};

	const sendMatchingQuitEvent = (): void => {
		if (socketManager.connected) {
			socketManager.send("matching-quit");
		}
	};

	// matching-found-sender
	// /* sender 입장에서 바로 매칭 상대 찾을 경우 처리 */
	// socket.on("matching-found-sender", (data) => {
	//   console.log("/profile에서 matching-found-sender 이벤트 on");
	//   router.push(
	//     `/matching/complete?role=sender&opponent=true&type=${params}&rank=${rank}&user=${encodeURIComponent(
	//       JSON.stringify(data.data)
	//     )}`
	//   );
	// });

	return (
		<>
			<MatchHeader
				step="profile"
				title="프로필 등록"
				onBack={() => funnel.toStep("game-mode")}
			/>
			<div className="w-full flex justify-center items-center">
				<div className="w-full flex flex-col items-center gap-4">
					<div className="w-full flex bg-violet-100 rounded-2xl p-4">
						<ProfileAvatar size="lg" profileIndex={2} />
						<div className="flex flex-col items-center gap-2">
							<p>
								{user?.gameName} {user?.tag}
							</p>
							<p>
								{user?.soloTier} {user?.freeTier}
							</p>
							<p>
								{user?.gameStyleResponseList
									?.map((style) => style.gameStyleName)
									.join(", ")}
							</p>
							<p>{user?.mike}</p>
						</div>
					</div>
					<div className="flex justify-end w-full">
						<Button
							variant="default"
							className="h-14 w-[380px] rounded-2xl px-8"
							onClick={handleMatchStart}
						>
							매칭 시작하기
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

export default ProfileStep;
