import { Skeleton } from "@/shared/ui/skeleton/skeleton-ui";

export default function UserInfoSkeleton() {
	return (
		<div className="mb-48 flex h-full w-full flex-col gap-9 pt-[68px]">
			<section className="flex w-full flex-col gap-5">
				<Skeleton variant="text" width={350} height={52} />
				<Skeleton variant="rounded" width={"100%"} height={466} />
			</section>
			<div className="grid grid-cols-[750px_auto_auto] grid-rows-2 gap-x-3 gap-y-9">
				<Skeleton variant="rounded" width={750} height={309} />
				<Skeleton variant="rounded" width={"100%"} height={309} />
				<Skeleton variant="rounded" width={"100%"} height={309} />
				<Skeleton variant="rounded" width={"100%"} height={309} />
			</div>
		</div>
	);
}
