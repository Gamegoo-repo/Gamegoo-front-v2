import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import { userKeys } from "@/entities/user/config/query-keys";
import UserProfile from "@/entities/user/ui/user-profile";
import { api } from "@/shared/api";
import PencilIcon from "@/shared/assets/icons/pencil.svg?react";
import { cn } from "@/shared/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface EditableProfileAvatarProps {
	variant: "sm" | "lg";
}

function EditableProfileAvatar({ variant }: EditableProfileAvatarProps) {
	const { data: userInfo } = useFetchMyInfo();
	const [localProfileId, setLocalProfileId] = useState<number>(
		userInfo?.profileImg ?? 0,
	);

	useEffect(() => {
		setLocalProfileId(userInfo?.profileImg ?? 0);
	}, [userInfo?.profileImg]);

	const queryClient = useQueryClient();

	const { mutate: updateProfileImage, isPending } = useMutation({
		mutationFn: async (id: number) => {
			await api.private.member.modifyProfileImage({ profileImage: id });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.me() });
		},
	});

	const PROFILE_IDS = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);

	const profileSizeClass =
		variant === "sm" ? "w-[60px] h-[60px]" : "w-[180px] h-[180px]";

	const pencilSizeClass =
		variant === "sm" ? "w-[24px] h-[24px]" : "w-[40px] h-[40px]";

	const pencilWrapperSizeClass =
		variant === "sm" ? "w-[28px] h-[28px]" : "w-[48px] h-[48px]";

	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<button type="button" className="relative" aria-label="프로필 변경">
						<UserProfile
							id={localProfileId}
							sizeClass={profileSizeClass}
							hasDropShadow
						/>
						<div
							className={cn(
								"absolute bottom-0 left-0 flex items-center justify-center rounded-full bg-gray-800/75",
								pencilWrapperSizeClass,
							)}
						>
							<PencilIcon className={pencilSizeClass} />
						</div>
					</button>
				</PopoverTrigger>

				{/* ⬇️ Popover 모바일 대응 (데스크탑 유지) */}
				<PopoverContent
					className="
            popover
            w-[calc(100vw-32px)]
            mobile:w-[520px]
            rounded-2xl
            border border-black/15
            bg-black/70
            p-4 mobile:p-6
            text-white
            shadow-[0_4px_18px_rgba(0,0,0,0.25)]
            backdrop-blur-md
          "
				>
					<p className="bold-20 mb-4">프로필 이미지 선택</p>

					{/* ⬇️ grid 모바일 대응 */}
					<div className="grid grid-cols-3 mobile:grid-cols-4 gap-3 mobile:gap-4">
						{PROFILE_IDS.map((id) => {
							const isSelected = id === localProfileId;

							return (
								<button
									key={id}
									type="button"
									onClick={() => {
										setLocalProfileId(id);
										updateProfileImage(id);
									}}
									disabled={isPending}
									className="group relative rounded-full p-1 transition"
									aria-label={`프로필 ${id} 선택`}
								>
									<div
										className={cn(
											`
                      flex items-center justify-center rounded-full border-2
                      w-[72px] h-[72px]
                      mobile:w-[96px] mobile:h-[96px]
                    `,
											isSelected
												? "border-white ring-4 ring-violet-400/60"
												: "border-transparent hover:border-white/40",
										)}
									>
										<img
											src={`/profile/profile${id}.svg`}
											alt={`Profile ${id}`}
											className="
                        w-[56px] h-[56px]
                        mobile:w-[76px] mobile:h-[76px]
                      "
										/>
									</div>

									{isSelected && (
										<span
											className="
                        absolute top-[2px] left-[2px]
                        inline-flex h-6 w-6
                        mobile:h-7 mobile:w-7
                        items-center justify-center
                        rounded-full
                        border-2 border-white
                        bg-violet-600
                        text-white
                        shadow
                      "
										>
											✓
										</span>
									)}
								</button>
							);
						})}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export default EditableProfileAvatar;
