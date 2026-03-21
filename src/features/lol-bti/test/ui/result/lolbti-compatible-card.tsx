import UserProfile from "@/entities/user/ui/user-profile";
import { LolBtiTypeInfo } from "./lolbti-type-info";
import type { LolBtiResultType } from "../../config";

const MOCK_USERS = [
	{ profileImage: 5, name: "핸들이고장난8톤트럭", tag: "#1116" },
	{ profileImage: 3, name: "비폭력주의자K", tag: "#3491" },
	{ profileImage: 1, name: "안졸리나젤림", tag: "#9897" },
	{ profileImage: 7, name: "키보드음료수쏟아서고..", tag: "#6182" },
	{ profileImage: 4, name: "Hide on Bushh", tag: "#8129" },
	{ profileImage: 8, name: "하고싶은거합시다", tag: "#2192" },
	{ profileImage: 3, name: "문도석사", tag: "#1293" },
	{ profileImage: 5, name: "따뜻한아이스아메리카노", tag: "#9281" },
];

function LolBtiMatchCard({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex w-full flex-col items-center gap-6 rounded-2xl border-2 border-[#444] bg-[#2A2A2A] pt-4 pb-6">
			{children}
		</div>
	);
}

type LolBtiCompatibleCardProps = {
	type: LolBtiResultType;
	title: string;
	quote: string;
};

export default function LolBtiCompatibleCard({
	type,
	title,
	quote,
}: LolBtiCompatibleCardProps) {
	return (
		<LolBtiMatchCard>
			<LolBtiTypeInfo type={type} title={title} quote={quote} size="sm" />
			<div className="w-full overflow-hidden">
				<ul className="flex w-max animate-[marquee_20s_linear_infinite] items-center gap-2 pl-4">
					{[...MOCK_USERS, ...MOCK_USERS].map(
						(user, index) => (
							<li
								key={`${index}-${user.name}`}
								className="flex w-fit items-center gap-2 rounded-xl bg-gray-700 p-2 pr-4"
							>
								<UserProfile id={user.profileImage} sizeClass="size-10" />
								<div className="flex flex-col flex-nowrap gap-0.5 font-medium text-white blur-[2px]">
									<span className="text-sm">{user.name}</span>
									<span className="text-gray-500 text-xs">{user.tag}</span>
								</div>
							</li>
						),
					)}
				</ul>
			</div>
			<div className="w-full px-4">
				<button
					type="button"
					className="w-full cursor-pointer rounded-lg bg-violet-600 py-4 font-bold text-base text-white leading-none transition-all duration-300 hover:text-gray-300 active:scale-95"
				>
					{type} 유저와 게임하러가기
				</button>
			</div>
		</LolBtiMatchCard>
	);
}

export function LolBtiIncompatibleCard({
	type,
	title,
	quote,
}: {
	type: string;
	title: string;
	quote: string;
}) {
	return (
		<LolBtiMatchCard>
			<LolBtiTypeInfo type={type} title={title} quote={quote} size="sm" />
		</LolBtiMatchCard>
	);
}
