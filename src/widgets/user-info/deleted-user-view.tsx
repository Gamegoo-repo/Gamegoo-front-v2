import UserProfileHeader from "@/features/profile/user-profile-header";
import MannerKeywordsCard from "./manner-keywords-card";
import MannerLevelCard from "./manner-level-card";

export default function DeletedUserView() {
	return (
		<div className="w-full h-full pt-[68px] flex flex-col gap-9 mb-48">
			<section className="w-full flex flex-col gap-5">
				<UserProfileHeader relationshipStatus="deleted">
					탈퇴한 사용자님의 프로필
				</UserProfileHeader>
				<div className="w-full bg-gray-100 rounded-[30px] px-10 py-11">
					<div className="flex items-center gap-10">
						<div className="w-[186px] h-[186px] rounded-full bg-gray-600" />
						<div className="flex flex-col gap-9">
							<h3 className="text-gray-800 bold-32">탈퇴한 사용자</h3>
							<div className="flex gap-[60px]">
								<div className="flex gap-6">
									<InfoItem label="주 포지션" value="-" />
									<InfoItem label="부 포지션" value="-" />
								</div>
								<InfoItem label="내가 찾는 포지션" value="-" />
								<InfoItem label="최근 선호 챔피언" value="-" />
							</div>
						</div>
					</div>
				</div>
			</section>
			<div className="grid grid-cols-[1fr_auto_auto] grid-rows-2 gap-y-9 gap-x-3">
				<MannerLevelCard
					userProfile={{ gameName: "탈퇴한 사용자" }}
					userMannerLevelData={{ mannerLevel: 1, mannerRatingCount: 0 }}
				/>
				<MannerKeywordsCard
					title={"받은 매너 평가"}
					keywords={Array.from({ length: 6 }, (_, idx) => ({
						mannerKeywordId: idx + 1,
						count: 0,
					}))}
					type="positive"
				/>
				<MannerKeywordsCard
					title={"받은 비매너 평가"}
					keywords={Array.from({ length: 6 }, (_, idx) => ({
						mannerKeywordId: idx + 7,
						count: 0,
					}))}
					type="negative"
				/>
			</div>
		</div>
	);
}

interface InfoItemProps {
	label: string;
	value: string | React.ReactNode;
}

export function InfoItem({ label, value }: InfoItemProps) {
	return (
		<p className="text-gray-600 medium-14 flex flex-col gap-3">
			<span>{label}</span>
			<span>{value}</span>
		</p>
	);
}
