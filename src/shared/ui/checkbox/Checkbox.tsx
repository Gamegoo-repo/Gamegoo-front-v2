import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type * as React from "react";
import CheckIcon from "@/shared/assets/icons/check_icon.svg?react";

import { cn } from "@/shared/lib/utils";

function Checkbox({
	isChecked,
	className,
	onCheckedChange,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	isChecked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			checked={isChecked}
			onCheckedChange={onCheckedChange}
			className={cn(
				"size-5 shrink-0 rounded-[4px] border border-gray-500 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 hover:border-gray-400 hover:cursor-pointer",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="flex items-center justify-center text-current transition-none"
			>
				<CheckIcon className="w-[80%]" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
