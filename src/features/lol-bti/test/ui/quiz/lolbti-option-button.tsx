import { FlexBox } from "@/shared/ui/flexbox";

interface LolBtiOptionButtonProps {
	label: "A" | "B";
	text: string;
	onSelectOption: () => void;
}

export function LolBtiOptionButton({
	label,
	text,
	onSelectOption,
}: LolBtiOptionButtonProps) {
	return (
		<FlexBox direction="column" justify="between" align="start" asChild>
			<button
				type="button"
				className="hover:-translate-y-0.5 w-full cursor-pointer gap-2 rounded-[20px] border-2 border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-violet-600 hover:shadow-[0_10px_30px_0_rgba(90,66,238,0.61)] active:scale-[97%] active:border-white active:bg-black/5"
				onClick={onSelectOption}
			>
				<span className="flex size-8 items-center justify-center rounded-full bg-violet-600 font-semibold text-lg text-white">
					{label}
				</span>
				<span className="font-medium text-lg text-white">{text}</span>
			</button>
		</FlexBox>
	);
}
