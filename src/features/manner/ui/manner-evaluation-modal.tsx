import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	BAD_MANNER_TYPES,
	MANNER_TYPES,
} from "@/entities/user/config/manner.types";
import {
	api,
	type MannerInsertRequest,
	type MannerUpdateRequest,
} from "@/shared/api";
import CloseButton from "@/shared/ui/button/close-button";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import Modal from "@/shared/ui/modal/modal";

type MannerType = "manner" | "badManner";

export default function MannerEvaluationModal({
	isOpen,
	onClose,
	memberId,
	type,
}: {
	isOpen: boolean;
	onClose: () => void;
	memberId: number | undefined;
	type: MannerType;
}) {
	const queryClient = useQueryClient();
	const isPositive = type === "manner";
	const titleDefault = isPositive ? "매너 평가하기" : "비매너 평가하기";
	const contentRef = useRef<HTMLDivElement | null>(null);

	const { data: existingData, isLoading } = useQuery({
		queryKey: ["manner-existing", memberId, type],
		queryFn: async () => {
			if (!memberId) return null;
			const res = isPositive
				? await api.private.manner.getPositiveMannerRatingInfo(memberId)
				: await api.private.manner.getNegativeMannerRatingInfo(memberId);
			return res.data.data || null;
		},
		enabled: isOpen && !!memberId,
		staleTime: 0,
	});

	const [selected, setSelected] = useState<number[]>([]);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!isOpen) return;
		if (existingData?.mannerKeywordIdList?.length) {
			setSelected(existingData.mannerKeywordIdList);
		} else {
			setSelected([]);
		}
		setIsEditing(true);
	}, [isOpen, existingData]);

	const keywords = useMemo(() => {
		return isPositive ? MANNER_TYPES : BAD_MANNER_TYPES;
	}, [isPositive]);

	const addMutation = useMutation({
		mutationFn: async (payload: MannerInsertRequest) => {
			if (!memberId) throw new Error("memberId is required");
			if (isPositive) {
				return (
					await api.private.manner.addPositiveMannerRating(memberId, payload)
				).data;
			}
			return (
				await api.private.manner.addNegativeMannerRating(memberId, payload)
			).data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["manner-existing", memberId, type],
			});
			onClose();
		},
	});

	const updateMutation = useMutation({
		mutationFn: async (payload: MannerUpdateRequest) => {
			if (!existingData?.mannerRatingId)
				throw new Error("mannerRatingId is required");
			return (
				await api.private.manner.updateMannerRating(
					existingData.mannerRatingId,
					payload,
				)
			).data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["manner-existing", memberId, type],
			});
			onClose();
		},
	});

	const isSubmitting = addMutation.isPending || updateMutation.isPending;
	const canSubmit =
		selected.length > 0 && (isEditing || !existingData?.mannerRatingId);

	const handleToggle = (id: number) => {
		if (!isEditing && existingData?.mannerRatingId) return;
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const handleSubmit = () => {
		const payload = { mannerKeywordIdList: selected };
		if (existingData?.mannerRatingId) {
			updateMutation.mutate(payload);
		} else {
			addMutation.mutate(payload);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			contentRef={contentRef}
			hasCloseButton={false}
			className="w-[360px] max-w-[90vw] rounded-[20px] bg-white px-[31px] py-[26px]"
		>
			<header className="flex items-center justify-between">
				<p className="bold-20 text-gray-900">{titleDefault}</p>
				<button
					type="button"
					aria-label="닫기"
					onClick={onClose}
					className="p-1 hover:bg-gray-200"
				>
					<span className="sr-only">닫기</span>
					<CloseButton
						className="-translate-x-[24px] absolute top-0 right-0 translate-y-[24px] hover:rounded-lg hover:bg-gray-300"
						onClose={onClose}
					/>
				</button>
			</header>

			<main className="mt-5">
				<div className="flex flex-col items-start gap-5">
					{keywords.map((k) => (
						<label
							key={k.id}
							htmlFor={k.id.toString()}
							className="flex cursor-pointer select-none items-center gap-3"
						>
							<Checkbox
								isChecked={selected.includes(k.id)}
								onCheckedChange={() => handleToggle(k.id)}
								disabled={!isEditing && !!existingData?.mannerRatingId}
							/>
							<span className="semi-bold-16 text-gray-800">{k.text}</span>
						</label>
					))}
				</div>

				<div className="mt-[40px] flex items-center justify-end">
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!canSubmit || isLoading || isSubmitting}
						className="semi-bold-16 h-[52px] w-full rounded-[6px] bg-violet-600 px-5 text-white disabled:bg-gray-300"
					>
						확인
					</button>
				</div>
			</main>
		</Modal>
	);
}
