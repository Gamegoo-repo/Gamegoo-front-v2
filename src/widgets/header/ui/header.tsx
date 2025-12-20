import UserProfileMenu from "@/features/user/user-profile-menu";
import { useAuth } from "@/shared/model/use-auth";
import { LogoButton } from "@/shared/ui/logo";
import HeaderNav from "./header-nav";
import LoginButton from "./login-button";

export default function Header() {
	const { isAuthenticated, user } = useAuth();
	return (
		<header className="relative mx-auto my-0 mobile:mt-16 mt-5 box-border flex w-full max-w-[1440px] items-center justify-center">
			<div className="flex w-full flex-row flex-wrap mobile:flex-nowrap items-center justify-between">
				<div className="order-1 mobile:pl-0 pl-5 text-violet-600">
					<LogoButton className="w-[114px]" />
				</div>

				<div className="order-3 mobile:w-auto w-full mobile:grow">
					<HeaderNav />
				</div>

				<div className="mobile:order-3 order-2 mobile:pr-0 pr-5">
					{!isAuthenticated && <LoginButton />}
					{isAuthenticated && user && (
						<UserProfileMenu
							profileImage={user.profileImage}
							name={user.name}
						/>
					)}
				</div>
			</div>
		</header>
	);
}
