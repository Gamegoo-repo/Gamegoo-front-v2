import { Skeleton } from "@/shared/ui/skeleton/skeleton-ui";

export default function LolBtiCardSkeleton() {
	return (
		<div className="flex flex-col items-center rounded-[20px] bg-gray-100 p-4 pt-6 shadow-[0px_4px_20px_0_rgba(0,0,0,0.25)]">
			<Skeleton variant="text" width={80} height={12} className="mb-4" />
			<div className="mb-6 flex flex-col items-center gap-1.5">
				<Skeleton variant="circular" width={52} height={40} />
				<Skeleton variant="text" width={96} height={14} />
			</div>

			<Skeleton variant="circular" width={132} height={132} className="mb-3" />

			<Skeleton variant="text" width={100} height={20} className="mb-7" />

			<div className="mb-4 flex w-full items-center justify-center gap-4 rounded-[10px] bg-gray-200 px-4 py-2">
				{[0, 1, 2].map((index) => (
					<Skeleton key={index} variant="circular" width={44} height={44} />
				))}
			</div>

			<div className="flex w-full items-center gap-2">
				<Skeleton
					variant="rounded"
					width="100%"
					height={54}
					className="flex-1"
				/>
				<Skeleton
					variant="rounded"
					width="100%"
					height={54}
					className="flex-1"
				/>
			</div>
		</div>
	);
}
