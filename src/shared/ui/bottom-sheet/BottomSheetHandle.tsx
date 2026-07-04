interface Props {
  dragHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
}

export function BottomSheetHandle({ dragHandleProps }: Props) {
  return (
    <div>
      <div
        {...dragHandleProps}
        className="flex cursor-grab touch-none justify-center py-4 active:cursor-grabbing"
        aria-label="드래그해서 크기 조절"
        role="separator"
      >
        <div className="h-1 w-12 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}
