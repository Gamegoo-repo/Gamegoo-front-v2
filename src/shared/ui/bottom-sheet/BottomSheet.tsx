import { FlexBox } from '@gamegoo-ui/design-system';
import { createPortal } from 'react-dom';

import { cn } from '@/shared/lib/utils';

import { BottomSheetHandle } from './BottomSheetHandle';
import { BottomSheetHeader } from './BottomSheetHeader';
import type { BottomSheetProps } from './types';
import { useBottomSheet } from './useBottomSheet';
import { usePreventScroll } from './usePreventScroll';

const portalTarget = document.body;

export function BottomSheet({ isOpen, onClose, title, children, halfRatio }: BottomSheetProps) {
  const { sheetRef, currentSnap, snapTo, dragHandleProps } = useBottomSheet({
    isOpen,
    onClose,
    halfRatio,
  });

  usePreventScroll(isOpen);

  const isFull = currentSnap === 'full';

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 touch-none" style={{ zIndex: 100 }}>
      {/* backdrop */}
      <div
        data-backdrop
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          snapTo('closed');
        }}
      />
      <div
        ref={sheetRef}
        className={cn(
          'fixed right-0 bottom-0 left-0',
          'flex flex-col bg-white',
          'overflow-hidden',
          isFull ? 'rounded-none' : 'rounded-t-2xl'
        )}
        style={{ top: '100%' }}
      >
        {/* 하프: 핸들 */}
        {!isFull && <BottomSheetHandle dragHandleProps={dragHandleProps} />}

        <FlexBox direction="column" gap={8} className="w-full flex-1 overflow-hidden px-5 pt-2">
          <BottomSheetHeader
            title={title}
            onBack={isFull ? () => snapTo('closed', false) : undefined}
          />
          <div
            className="flex w-full flex-1 flex-col overflow-y-auto pb-8"
            style={{ touchAction: 'pan-y' }}
          >
            {children({ snapTo })}
          </div>
        </FlexBox>
      </div>
    </div>,
    portalTarget
  );
}
