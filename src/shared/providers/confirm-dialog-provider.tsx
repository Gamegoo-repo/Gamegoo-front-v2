import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { ConfirmDialog } from "@/shared/ui/dialog";

interface ConfirmDialogState {
	isOpen: boolean;
	title: string;
	description?: string;
	confirmText: string;
	cancelText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	isLoading?: boolean;
	disabled?: boolean;
}

interface ConfirmDialogContextType {
	showConfirmDialog: (config: Omit<ConfirmDialogState, "isOpen">) => void;
	hideConfirmDialog: () => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(
	null,
);

export function ConfirmDialogProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [dialogState, setDialogState] = useState<ConfirmDialogState>({
		isOpen: false,
		title: "",
		description: "",
		confirmText: "",
		cancelText: "취소",
		isLoading: false,
		disabled: false,
	});

	const showConfirmDialog = useCallback(
		(config: Omit<ConfirmDialogState, "isOpen">) => {
			setDialogState({
				...config,
				isOpen: true,
			});
		},
		[],
	);

	const hideConfirmDialog = useCallback(() => {
		setDialogState((prev) => ({
			...prev,
			isOpen: false,
		}));
	}, []);

	const handleConfirm = useCallback(() => {
		dialogState.onConfirm?.();
		hideConfirmDialog();
	}, [dialogState.onConfirm, hideConfirmDialog]);

	const handleCancel = useCallback(() => {
		dialogState.onCancel?.();
		hideConfirmDialog();
	}, [dialogState.onCancel, hideConfirmDialog]);

	return (
		<ConfirmDialogContext.Provider
			value={{ showConfirmDialog, hideConfirmDialog }}
		>
			{children}
			<ConfirmDialog
				isOpen={dialogState.isOpen}
				onOpenChange={(open) => {
					if (!open) {
						hideConfirmDialog();
					}
				}}
				title={dialogState.title}
				description={dialogState.description}
				confirmText={dialogState.confirmText}
				cancelText={dialogState.cancelText}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				isLoading={dialogState.isLoading}
				disabled={dialogState.disabled}
			/>
		</ConfirmDialogContext.Provider>
	);
}

export function useConfirmDialog() {
	const context = useContext(ConfirmDialogContext);
	if (!context) {
		throw new Error(
			"useConfirmDialog must be used within a ConfirmDialogProvider",
		);
	}
	return context;
}
