import { Skeleton } from "@/shared/ui/skeleton/skeleton-ui";

export default function UserInfoSkeleton() {
	return (
		<div className="w-full h-full pt-[68px] flex flex-col gap-9 mb-48">
			<section className="w-full flex flex-col gap-5">
				<Skeleton variant="text" width={350} height={52} />
				<Skeleton variant="rounded" width={"100%"} height={466} />
			</section>
			<div className="grid grid-cols-[750px_auto_auto] grid-rows-2 gap-y-9 gap-x-3">
				<Skeleton variant="rounded" width={750} height={309} />
				<Skeleton variant="rounded" width={"100%"} height={309} />
				<Skeleton variant="rounded" width={"100%"} height={309} />
				<Skeleton variant="rounded" width={"100%"} height={309} />
			</div>
		</div>
	);
}
