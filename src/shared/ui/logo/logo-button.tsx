import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

type LogoProps = {
	className?: string;
	size?: "sm" | "md" | "lg";
};

export function LogoButton({ className, size }: LogoProps) {
	return (
		<Link to="/">
			<Logo className={className} size={size} />
		</Link>
	);
}
