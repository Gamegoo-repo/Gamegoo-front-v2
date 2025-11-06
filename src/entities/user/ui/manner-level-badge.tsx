export default function MannerLevelBadge({
	mannerLevel,
}: {
	mannerLevel: number;
}) {
	return (
		<div className="w-full text-center bold-16 text-violet-600 inline-block whitespace-nowrap min-w-max">
			LV. {mannerLevel}
		</div>
	);
}
