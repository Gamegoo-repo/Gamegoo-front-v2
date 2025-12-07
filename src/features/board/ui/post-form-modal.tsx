import type { AxiosError } from "axios";
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
import { cn } from "@/shared/lib/utils";
import CloseButton from "@/shared/ui/button/close-button";
import Dropdown from "@/shared/ui/dropdown/dropdown";
import Modal from "@/shared/ui/modal/modal";
import { Switch } from "@/shared/ui/toggle-switch/switch";
import { useCreatePost } from "../api/use-create-post";
import { GAME_STYLE } from "../config/game-styles";
import GameStylePopover from "./game-style-popover";
import PositionSelector from "./position-selector";
import { toast } from "@/shared/lib/toast";

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

export default function PostFormModal({
	isOpen,
	onClose,
	mode,
	postToEdit,
	userInfo,
}: {
	isOpen: boolean;
	onClose: () => void;
	mode: "create" | "edit";
	postToEdit?: BoardFormData;
	userInfo: MyProfileResponse;
}) {
	const [formData, setFormData] = useState(() =>
		!postToEdit ? INITIAL_BOARD_FORM : postToEdit,
	);
	const [contentError, setContentError] = useState<string | undefined>(
		undefined,
	);
	const modalRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutate } = useCreatePost();

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
		mutate(form, {
			onSuccess: () => {
				alert("성공적으로 제출하였습니다.");
				handleClose();
			},
			onError: (error: AxiosError<ApiErrorResponse>) => {
				/** TODO: ANY 보다 더 좋은 타입이 있나 체크*/

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
		mutate(form, {
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
		});
	};

	return (
		<Modal
			isBackdropClosable={false}
			isOpen={isOpen}
			onClose={handleClose}
			className="w-[555px]"
			contentRef={modalRef}
		>
			<form className="flex flex-col gap-5">
				<section className="flex flex-col gap-[30px]">
					<UserProfileCard
						{...{
							profileImage: userInfo.profileImg,
							tag: userInfo.tag,
							gameName: userInfo.gameName,
						}}
					/>
					<div className="w-full">
						<p className="label mb-1.5">포지션</p>
						<div className="flex h-[98px] w-full gap-2">
							<div className="h-full flex-1 rounded-[10px] bg-white px-11 py-4">
								<ul className="flex h-full w-full justify-between">
									<li className="flex h-full w-[49px] flex-col items-center justify-between">
										<span className="bold-12 w-full text-center text-gray-700">
											주 포지션
										</span>
										<PositionSelector
											onChangePosition={(newState) =>
												handleChangeFormData("mainP", newState)
											}
											selectedPosition={formData.mainP}
											title={"주 포지션 선택"}
											containerRef={modalRef}
										/>
									</li>

									<li className="flex h-full w-[49px] flex-col items-center justify-between">
										<span className="bold-12 w-full text-center text-gray-700">
											부 포지션
										</span>
										<PositionSelector
											onChangePosition={(newState) =>
												handleChangeFormData("subP", newState)
											}
											selectedPosition={formData.subP}
											title={"부 포지션 선택"}
											containerRef={modalRef}
										/>
									</li>
								</ul>
							</div>
							<div className="flex h-full flex-1 flex-col items-center justify-between rounded-[10px] bg-white px-11 py-4">
								<span className="bold-12 text-gray-700">내가 찾는 포지션</span>

								<ul className="flex w-full items-end justify-center gap-4">
									<li className="flex flex-col items-center justify-between">
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
											title={"내가 찾는 포지션"}
											containerRef={modalRef}
										/>
									</li>

									<li className="flex flex-col justify-between gap-3">
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
											title={"내가 찾는 포지션"}
											containerRef={modalRef}
										/>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<p className="label">선호 게임 모드</p>
						<Dropdown
							className="w-[240px]"
							variant="secondary"
							size="lg"
							selectedLabel={getGameModeTitle(formData.gameMode)}
							onSelect={(value) => {
								if (value) handleChangeFormData<"gameMode">("gameMode", value);
							}}
							items={GAME_MODE_ITEMS.slice(1)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="label">게임 스타일</p>
						<div className="flex w-full flex-wrap items-center gap-2 gap-y-3">
							{formData.gameStyles.map((styleId, _idx) => {
								const style = GAME_STYLE.find(
									(item) => item.gameStyleId === styleId,
								);
								return style ? (
									<span
										key={styleId}
										className="flex items-center justify-center gap-1 rounded-full bg-white px-3 py-1"
									>
										{style.gameStyleName}
										{/** TODO: 임의로 넣어본 부분이라 허락 받아야 함*/}
										<CloseButton
											className="rounded-full p-0 hover:bg-gray-100"
											iconClass="w-5 text-gray-600"
											onClose={() => handleGameStyleToggle(styleId)}
										/>
									</span>
								) : null;
							})}
							<GameStylePopover
								selectedGameStyle={formData.gameStyles}
								containerRef={modalRef}
								onChangeGameStyle={handleGameStyleToggle}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
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
								"h-[70px] w-full resize-none rounded-10 border-1 border-gray-400 px-2.5 py-2 transition-colors duration-150 focus:border-violet-400 focus:outline-none",
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
						disabled={!isFormValid || postToEdit === formData}
						onClick={mode === "create" ? onCreatePost : onEditPost}
						type="button"
						className="primary-btn w-full py-[18px] disabled:bg-gray-400"
					>
						{mode === "create" ? "작성 완료" : "수정 완료"}
					</button>
				</section>
			</form>
		</Modal>
	);
}
