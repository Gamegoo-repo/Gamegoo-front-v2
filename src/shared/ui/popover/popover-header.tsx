import { useContext } from "react";
import { PopoverContext } from "./popover";
import CloseButton from "@/shared/ui/button/close-button";

export default function PopoverHeader({ title }: { title: string }) {
	const context = useContext(PopoverContext);

	return (
		<header className="w-full flex items-center justify-between">
			<span className="text-white bold-20">{title}</span>
			<CloseButton className="text-white" onClose={() => context?.close()} />
		</header>
	);
}
