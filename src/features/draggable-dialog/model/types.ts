export interface Position {
	top: string;
	left: string;
}

export interface DragOffset {
	x: number;
	y: number;
}

export type AdjustPositionCallback = (position: Position) => Position;

export interface DraggableDialogState {
	position: Position;
	isDragging: boolean;
	setPosition: (position: Position) => void;
	setIsDragging: (isDragging: boolean) => void;
	resetPosition: () => void;
}
