import { getPositionIcon } from '@/entities/game/lib/getPositionIcon';
import type { Position } from '@/shared/api';

export default function UserPositions({
  mainPosition,
  subPosition,
}: {
  mainPosition: Position;
  subPosition: Position;
}) {
  const MainPositionIcon = getPositionIcon(mainPosition);
  const SubPositionIcon = getPositionIcon(subPosition);
  return (
    <ol className="flex items-center justify-center gap-0.5">
      <li>
        <MainPositionIcon className="w-8 text-gray-700" />
      </li>
      <li>
        <SubPositionIcon className="w-8 text-gray-700" />
      </li>
    </ol>
  );
}
