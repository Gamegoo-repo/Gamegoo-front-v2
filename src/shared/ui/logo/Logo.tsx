import LogoIcon from "@/shared/assets/icons/logo.svg?react";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
	className?: string;
	size?: "sm" | "md" | "lg";
};

export function Logo({ className, size }: LogoProps) {
	return (
		<LogoIcon className={cn(className, size === "md" ? "w-[314px]" : "")} />
	);
}
