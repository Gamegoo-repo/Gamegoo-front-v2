import { Link } from "@tanstack/react-router";
import LogoIcon from "@/shared/assets/icons/logo.svg?react";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
	className?: string;
	size?: "sm" | "md" | "lg";
};

export function LogoButton({ className, size }: LogoProps) {
	return (
		<Link to="/">
			<LogoIcon className={cn(className, size === "md" ? "w-[314px]" : "")} />
		</Link>
	);
}
