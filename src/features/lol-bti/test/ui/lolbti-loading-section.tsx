import { FlexBox } from "@/shared/ui/flexbox";
import { LolBtiLayout } from "./lolbti-layout";

export default function LolBtiLoadingSection() {
	return (
		<LolBtiLayout>
			<FlexBox
				direction="column"
				align="center"
				justify="center"
				className="h-full w-full"
			>
				<h1 className="font-bold text-2xl text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
					결과를 불러오는 중...
				</h1>
				<div className="mx-0 my-[2rem] flex items-center justify-center">
					<div className="size-10 animate-spin rounded-full border-4 border-[rgba(90,66,238,0.2)] border-t-violet-600" />
				</div>
			</FlexBox>
		</LolBtiLayout>
	);
}
