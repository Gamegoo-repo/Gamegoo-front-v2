import { useContext } from "react";
import CloseButton from "@/shared/ui/button/close-button";
import { PopoverContext } from "./popover";

export default function PopoverHeader({ title }: { title: string }) {
	const context = useContext(PopoverContext);

	return (
		<header className="flex w-full items-center justify-between">
			<span className="bold-20 text-white">{title}</span>
			<CloseButton className="text-white" onClose={() => context?.close()} />
		</header>
	);
}
