import { create } from 'zustand';
import type { DraggableDialogState, Position } from './types';

const DEFAULT_POSITION: Position = {
  top: '50%',
  left: '50%',
};

export const useDraggableDialogStore = create<DraggableDialogState>((set) => ({
  position: DEFAULT_POSITION,
  isDragging: false,
  setPosition: (position: Position) => set({ position }),
  setIsDragging: (isDragging: boolean) => set({ isDragging }),
  resetPosition: () => set({ position: DEFAULT_POSITION }),
}));