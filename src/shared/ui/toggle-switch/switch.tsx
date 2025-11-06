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
				" data-[state=checked]:bg-violet-400 data-[state=unchecked]:bg-gray-500 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-10 w-17 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"bg-white pointer-events-none block size-7 rounded-full ring-0 transition-transform ease-in-out duration-400 data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-1.5",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}
export { Switch };
