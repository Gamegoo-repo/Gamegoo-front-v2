import { tokenManager } from "@/shared/api";
import { LogoButton } from "@/shared/ui/logo";
import HeaderNav from "./header-nav";
import LoginButton from "./login-button";

export default function Header() {
	return (
		<header className="w-full max-w-[1440px] mt-5 mobile:mt-16 mx-auto my-0 flex items-center justify-center box-border relative">
			<div className="flex flex-row flex-wrap mobile:flex-nowrap justify-between items-center w-full">
				<div className="order-1 pl-5 mobile:pl-0 text-violet-600">
					<LogoButton className="w-[114px]" />
				</div>

				<div className="order-3 mobile:flex-grow w-full mobile:w-auto">
					<HeaderNav />
				</div>

				<div className="order-2 mobile:order-3 pr-5 mobile:pr-0">
					{tokenManager.getRefreshToken() == null && <LoginButton />}
				</div>
			</div>
		</header>
	);
}
