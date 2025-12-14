/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import type { AxiosError } from "axios";
import { isEqual } from "lodash-es";
import { useRef, useState } from "react";
import UserProfileCard from "@/entities/user/ui/user-profile-card";
import { GAME_MODE_ITEMS } from "@/features/board/config/dropdown-items";
import { getGameModeTitle } from "@/features/board/lib/getGameModeTitle";
import type {
	ApiErrorResponse,
	BoardInsertRequest,
	BoardUpdateRequest,
	Mike,
	MyProfileResponse,
	Position,
} from "@/shared/api";
import { toast } from "@/shared/lib/toast";
import { cn } from "@/shared/lib/utils";
import CloseButton from "@/shared/ui/button/close-button";
import { Card } from "@/shared/ui/card/card";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import Modal from "@/shared/ui/modal/modal";
import { Switch } from "@/shared/ui/toggle-switch/switch";
import { useCreatePost } from "../../api/use-create-post";
import { useUpdatePost } from "../../api/use-update-post";
import { GAME_STYLE } from "../../config/game-styles";
import GameStylePopover from "../game-style-popover";
import PositionSelector from "../position-selector";

export interface BoardFormData
	extends Omit<BoardInsertRequest, "mainP" | "subP" | "mike" | "contents"> {
	mainP?: Position;
	mike: Mike;
	subP?: Position;
	contents: string;
}

const INITIAL_BOARD_FORM: BoardFormData = {
	gameMode: "FAST",
	gameStyles: [],
	mainP: undefined,
	subP: undefined,
	mike: "UNAVAILABLE",
	wantP: [],
	contents: "",
};

export const validateBoardForm = (formData: BoardFormData): boolean => {
	return (
		formData.mainP !== undefined &&
		formData.subP !== undefined &&
		formData.wantP.length >= 1 &&
		formData.wantP.length <= 2 &&
		formData.gameStyles.length >= 1 &&
		formData.contents.trim().length > 0
	);
};

type CreateModeProps = {
	mode: "create";
	userInfo: MyProfileResponse;
};

type EditModeProps = {
	mode: "edit";
	postId: number;
	postToEdit: BoardFormData;
	userInfo: MyProfileResponse;
};

type PostFormModalProps = {
	isOpen: boolean;
	onClose: () => void;
} & (CreateModeProps | EditModeProps);

export default function PostFormModal(props: PostFormModalProps) {
	const { isOpen, onClose, userInfo } = props;

	const [formData, setFormData] = useState(() =>
		props.mode === "edit" ? props.postToEdit : INITIAL_BOARD_FORM,
	);
	const [contentError, setContentError] = useState<string | undefined>(
		undefined,
	);
	const modalRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutate: createPostMutate } = useCreatePost();
	const { mutate: updatePostMutate } = useUpdatePost();

	const isFormValid = validateBoardForm(formData);

	const resetFormData = () => {
		setFormData(INITIAL_BOARD_FORM);
		setContentError(undefined);
	};

	const handleChangeFormData = <K extends keyof BoardFormData>(
		k: K,
		newState: BoardFormData[K],
	) => {
		setFormData((prevData) => ({
			...prevData,
			[k]: newState,
		}));
	};

	const handleGameStyleToggle = (styleId: number) => {
		setFormData((prev) => {
			if (prev.gameStyles.includes(styleId)) {
				return {
					...prev,
					gameStyles: prev.gameStyles.filter((id) => id !== styleId),
				};
			} else if (prev.gameStyles.length < 3) {
				return { ...prev, gameStyles: [...prev.gameStyles, styleId] };
			}
			return prev;
		});
	};

	const handleClose = () => {
		resetFormData();
		onClose();
	};

	const onCreatePost = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (
			!formData.mainP ||
			!formData.subP ||
			!formData.gameStyles.length ||
			!formData.wantP.length
		) {
			console.error("필수 값이 누락되었습니다");
			return;
		}

		const form: BoardInsertRequest = {
			...formData,
			contents: formData.contents.trim(),
			mainP: formData.mainP,
			subP: formData.subP,
		};
		createPostMutate(form, {
			onSuccess: () => {
				toast.confirm("게시글이 작성되었습니다.");
				handleClose();
			},
			onError: (error: AxiosError<ApiErrorResponse>) => {
				if (error.response?.data?.code === "BOARD_408") {
					textareaRef.current?.focus();
					setContentError(error.response?.data.message);
				} else {
					handleClose();
				}
			},
		});
	};

	const onEditPost = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (props.mode !== "edit") {
			console.error("Edit mode required");
			return;
		}

		if (
			!formData.mainP ||
			!formData.subP ||
			!formData.gameStyles.length ||
			!formData.wantP.length
		) {
			console.error("필수 값이 누락되었습니다");
			return;
		}

		const form: BoardUpdateRequest = {
			...formData,
			mainP: formData.mainP,
			subP: formData.subP,
		};
		updatePostMutate(
			{ postId: props.postId, postData: form },
			{
				onSuccess: () => {
					toast.confirm("게시글을 수정하였습니다.");
					handleClose();
				},
				onError: (error: AxiosError<ApiErrorResponse>) => {
					if (error.response?.data?.code === "BOARD_408") {
						textareaRef.current?.focus();
						setContentError(error.response?.data.message);
					} else {
						handleClose();
					}
				},
			},
		);
	};

	return (
		<Modal
			isBackdropClosable={false}
			isOpen={isOpen}
			onClose={handleClose}
			className="mobile:w-[555px] w-full"
			ref={modalRef}
		>
			<form className="flex flex-col gap-5">
				<section className="flex flex-col gap-5 mobile:gap-[30px]">
					<UserProfileCard
						{...{
							profileImage: userInfo.profileImg,
							tag: userInfo.tag,
							gameName: userInfo.gameName,
						}}
					/>
					<fieldset className="w-full">
						<legend className="mb-1 mobile:mb-1.5 font-medium mobile:font-semibold mobile:text-sm text-[11px] text-gray-800">
							포지션
						</legend>

						{/** 포지션 카드 두 개 묶는 div */}
						<div className="grid h-fit mobile:h-[98px] w-full grid-cols-[1fr_1fr] grid-rows-1 gap-x-2">
							<Card
								padding="lg"
								rounded="lg"
								className="flex h-full flex-1 justify-center gap-3 mobile:gap-14 bg-white"
							>
								<PositionSelector
									label="주포지션"
									onChangePosition={(newState) =>
										handleChangeFormData("mainP", newState)
									}
									selectedPosition={formData.mainP}
									title={"주 포지션 선택"}
									containerRef={modalRef}
								/>

								<PositionSelector
									label="부포지션"
									onChangePosition={(newState) =>
										handleChangeFormData("subP", newState)
									}
									selectedPosition={formData.subP}
									title={"부 포지션 선택"}
									containerRef={modalRef}
								/>
							</Card>
							<Card
								padding="lg"
								rounded="lg"
								className="flex h-full flex-1 flex-col items-center justify-between mobile:gap-2 bg-white"
							>
								<span className="font-medium mobile:font-bold text-[11px] text-gray-700 text-xs">
									내가 찾는 포지션
								</span>
								<div className="flex h-full items-center gap-4">
									<PositionSelector
										onChangePosition={(newState) => {
											if (newState) {
												handleChangeFormData("wantP", [
													newState,
													...formData.wantP.slice(1),
												]);
											}
										}}
										selectedPosition={formData.wantP[0]}
										containerRef={modalRef}
									/>

									<PositionSelector
										onChangePosition={(newState) => {
											if (newState) {
												handleChangeFormData("wantP", [
													...formData.wantP.slice(0, 1),
													newState,
												]);
											}
										}}
										selectedPosition={formData.wantP[1]}
										containerRef={modalRef}
									/>
								</div>
							</Card>
						</div>
					</fieldset>
					<div className="flex flex-col gap-2">
						<label htmlFor="game-mode" className="label">
							선호 게임 모드
						</label>
						<Dropdown
							id="game-mode"
							className="w-1/2"
							variant="secondary"
							selectedLabel={getGameModeTitle(formData.gameMode)}
							onSelect={(value) => {
								if (value) handleChangeFormData<"gameMode">("gameMode", value);
							}}
							items={GAME_MODE_ITEMS.slice(1)}
						/>
					</div>
					<fieldset className="flex flex-col">
						<legend className="label mb-2 block">게임 스타일</legend>
						<div className="flex w-full flex-wrap items-center gap-2 gap-y-3">
							{formData.gameStyles.map((styleId, _idx) => {
								const style = GAME_STYLE.find(
									(item) => item.gameStyleId === styleId,
								);
								return style ? (
									<span
										key={styleId}
										className="flex items-center justify-center gap-1 rounded-full bg-white mobile:px-3 px-1 mobile:py-1 py-0.5 mobile:font-medium mobile:text-base text-[13px] text-gray-800"
									>
										{style.gameStyleName}
										{/** TODO: 임의로 넣어본 부분이라 허락 받아야 함*/}
										<CloseButton
											className="rounded-full p-0 hover:bg-gray-100"
											iconClass="w-3.5 mobile:w-5 text-gray-600"
											onClose={() => handleGameStyleToggle(styleId)}
										/>
									</span>
								) : null;
							})}
							<GameStylePopover
								selectedGameStyle={formData.gameStyles}
								containerRef={modalRef}
								onChangeGameStyle={handleGameStyleToggle}
								aria-label="게임 스타일 추가"
							/>
						</div>
					</fieldset>

					<div className="flex flex-col gap-1 mobile:gap-2">
						<p className="label">마이크</p>
						<Switch
							checked={formData.mike === "AVAILABLE"}
							onCheckedChange={(checked) =>
								handleChangeFormData<"mike">(
									"mike",
									checked ? "AVAILABLE" : "UNAVAILABLE",
								)
							}
						/>
					</div>

					<div className="group flex flex-col gap-2">
						<p className="label">한마디</p>

						<textarea
							ref={textareaRef}
							className={cn(
								"h-[70px] w-full resize-none rounded-10 border-1 border-gray-400 px-2.5 py-2 mobile:text-lg text-gray-700 text-xs transition-colors duration-150 focus:border-violet-400 focus:outline-none",
								contentError && "focus:border-red-500",
							)}
							maxLength={80}
							value={formData.contents}
							onChange={(e) => {
								if (contentError) {
									setContentError(undefined);
								}
								const text = e.target.value;
								if (text.length <= 80) {
									handleChangeFormData<"contents">("contents", text);
								}
							}}
						/>
						{contentError && (
							<small className="text-red-500">{contentError}</small>
						)}
						<span
							className={cn(
								"medium-11 text-gray-500 group-focus-within:text-violet-400",
								contentError && "text-red-500 group-focus-within:text-red-500",
							)}
						>
							{formData.contents?.length} / 80
						</span>
					</div>
				</section>

				{/* MODAL-ACTION */}
				<section className="modal-actions">
					<button
						disabled={
							!isFormValid ||
							(props.mode === "edit" && isEqual(props.postToEdit, formData))
						}
						onClick={props.mode === "create" ? onCreatePost : onEditPost}
						type="button"
						className="primary-btn w-full py-[18px] disabled:bg-gray-400"
					>
						{props.mode === "create" ? "작성 완료" : "수정 완료"}
					</button>
				</section>
			</form>
		</Modal>
	);
}
