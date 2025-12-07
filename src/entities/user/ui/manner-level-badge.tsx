export default function MannerLevelBadge({
	mannerLevel,
}: {
	mannerLevel: number;
}) {
	return (
		<div className="bold-16 inline-block w-full min-w-max whitespace-nowrap text-center text-violet-600">
			LV. {mannerLevel}
		</div>
	);
}
