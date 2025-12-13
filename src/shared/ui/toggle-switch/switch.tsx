import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/shared/lib/utils";

function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"inline-flex h-8 mobile:h-10 mobile:w-17 w-14 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-violet-400 data-[state=unchecked]:bg-gray-500 dark:data-[state=unchecked]:bg-input/80",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"pointer-events-none block mobile:size-7 size-5.5 rounded-full bg-white ring-0 transition-transform duration-400 ease-in-out data-[state=checked]:translate-x-6.5 data-[state=unchecked]:translate-x-1.5 mobile:data-[state=checked]:translate-x-8",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}
export { Switch };
