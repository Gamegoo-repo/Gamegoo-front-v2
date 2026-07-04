import { getPositionIcon } from '@/entities/game/lib/getPositionIcon';
import type { Position } from '@/shared/api';

export default function SearchingPosition({ wantingPositions }: { wantingPositions: Position[] }) {
  return (
    <ul className="flex justify-center gap-0.5">
      {wantingPositions.map((pos) => {
        const PositionIcon = getPositionIcon(pos);
        return (
          <li key={crypto.randomUUID()}>
            <PositionIcon className="w-8 text-gray-700" />
          </li>
        );
      })}
    </ul>
  );
}
