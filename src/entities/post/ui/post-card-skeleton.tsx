import { Skeleton } from "@/shared/ui/skeleton/skeleton-ui";

function PostCardSkeleton() {
	return (
		<div className="flex w-full flex-col gap-4 rounded-lg bg-gray-100 p-4">
			<div className="flex gap-2">
				<Skeleton width={44} height={44} variant={"circular"} />
				<div className="flex flex-col gap-1">
					<Skeleton width={85} height={24} variant={"rounded"} />
					<Skeleton width={40} height={20} variant={"rounded"} />
				</div>
			</div>

			<div className="flex w-full items-center">
				<Skeleton width={118} height={18} variant={"rounded"} />

				<div className="mx-3 h-3 border-gray-400 border-l" />

				<Skeleton width={118} height={18} variant={"rounded"} />
			</div>

			<div className="flex h-[68px] w-full gap-2">
				<div className="h-full flex-1">
					<Skeleton width={"100%"} height={"100%"} variant={"rounded"} />
				</div>

				<div className="h-full flex-1">
					<Skeleton width={"100%"} height={"100%"} variant={"rounded"} />
				</div>
			</div>
			<div className="flex h-fit w-full items-center gap-2">
				<ul className="flex flex-1 gap-1.5">
					{[1, 2, 3, 4].map((item) => {
						return (
							<Skeleton
								key={item}
								variant={"circular"}
								width={32}
								height={32}
							/>
						);
					})}
				</ul>
				<Skeleton width={70} />
			</div>

			<div className="w-full">
				<Skeleton width={"100%"} height={50} variant={"rounded"} />
			</div>
		</div>
	);
}

export default function PostCardSkeletons() {
	return [...Array(10)].map((item) => <PostCardSkeleton key={item} />);
}
