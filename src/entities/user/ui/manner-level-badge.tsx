export default function MannerLevelBadge({ mannerLevel }: { mannerLevel: number }) {
  return (
    <div className="bold-16 inline-block w-full min-w-max text-center whitespace-nowrap text-violet-600">
      LV. {mannerLevel}
    </div>
  );
}
