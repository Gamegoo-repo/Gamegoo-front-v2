import type { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useFetchMyInfo } from "@/entities/user/api/use-fetch-my-info";
import UserProfileCard from "@/entities/user/ui/user-profile-card";
import { GAME_MODE_ITEMS } from "@/features/board/config/dropdown-items";
import { getGameModeTitle } from "@/features/board/lib/getGameModeTitle";
import type {
	ApiErrorResponse,
	BoardInsertRequest,
	GameMode,
	Mike,
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
		formData.gameStyles.length >= 1
	);
};

export default function CreatePostModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { isPending, data, isError, error } = useFetchMyInfo();
	const [formData, setFormData] = useState(INITIAL_BOARD_FORM);
	const [contentError, setContentError] = useState<string | undefined>(
		undefined,
	);
	const modalRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutate } = useCreatePost();

	const isFormValid = validateBoardForm(formData);

	if (isPending) {
		return <>로딩 중...</>;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (!data) {
		return <div>사용자 정보를 불러오는 데 실패했습니다.</div>;
	}

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
				}
			},
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			className="w-[555px]"
			ref={modalRef}
		>
			<form className="flex flex-col gap-5">
				{/* MODAL-CONTENT */}
				<section className="flex flex-col gap-[30px]">
					{/** TODO: profileImag와 profileImg중 하나로 통일해주실 수 있나요  -> 바꿔준다고 하면 고치기*/}
					<UserProfileCard
						{...{
							profileImage: data.profileImg,
							tag: data.tag,
							gameName: data.gameName,
						}}
					/>
					<div className="w-full">
						<p className="label mb-1.5">포지션</p>
						<div className="flex gap-2 h-[98px] w-full">
							<div className="bg-white flex-1 rounded-[10px] h-full px-11 py-4">
								<ul className="w-full flex justify-between h-full">
									<li className="h-full flex flex-col items-center justify-between w-[49px]">
										<span className="text-gray-700 bold-12 w-full text-center">
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

									<li className="h-full flex flex-col items-center justify-between w-[49px]">
										<span className="text-gray-700 bold-12 w-full text-center">
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
							<div className="bg-white flex-1 rounded-[10px] h-full px-11 py-4 flex flex-col items-center justify-between">
								<span className="text-gray-700 bold-12">내가 찾는 포지션</span>

								<ul className="flex w-full justify-center gap-4 items-end">
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

									<li className="flex flex-col gap-3 justify-between">
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
							className="w-[240px] h-14 z-10"
							type="secondary"
							selectedLabel={getGameModeTitle(formData.gameMode)}
							defaultAction={
								(value) => handleChangeFormData("gameMode", value as GameMode) // TODO: 수정이 필요함
							}
							items={GAME_MODE_ITEMS.slice(1)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="label">게임 스타일</p>
						<div className="w-full flex gap-2 items-center flex-wrap gap-y-3">
							{formData.gameStyles.map((styleId, idx) => {
								const style = GAME_STYLE.find(
									(item) => item.gameStyleId === styleId,
								);
								return style ? (
									<span
										key={styleId}
										className="flex items-center justify-center	 px-3 py-1 bg-white rounded-full gap-1"
									>
										{style.gameStyleName}
										{/** TODO: 임의로 넣어본 부분이라 허락 받아야 함*/}
										<CloseButton
											className="p-0 hover:bg-gray-100 rounded-full"
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

					<div className="flex flex-col gap-2 group">
						<p className="label">한마디</p>

						<textarea
							ref={textareaRef}
							className={cn(
								"focus:outline-none transition-colors duration-150 focus:border-violet-400 w-full border-1 border-gray-400 rounded-10 h-[70px] px-2.5 py-2 resize-none",
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
								"text-gray-500 medium-11 group-focus-within:text-violet-400",
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
						disabled={!isFormValid}
						onClick={onCreatePost}
						type="button"
						className="primary-btn w-full py-[18px] disabled:bg-gray-400"
					>
						작성 완료
					</button>
				</section>
			</form>
		</Modal>
	);
}
