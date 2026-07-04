import UserProfileMenu from '@/features/user/user-profile-menu';
import { useAuth } from '@/shared/model/use-auth';
import { LogoButton } from '@/shared/ui/logo';

import HeaderNav from './header-nav';
import LoginButton from './login-button';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  return (
    <header className="relative mx-auto my-0 mt-5 box-border flex w-full max-w-[1440px] items-center justify-center mobile:mt-16">
      <div className="flex w-full flex-row flex-wrap items-center justify-between mobile:flex-nowrap">
        <div className="order-1 pl-5 text-violet-600 mobile:pl-0">
          <LogoButton className="w-[114px]" />
        </div>

        <div className="order-3 w-full mobile:w-auto mobile:grow">
          <HeaderNav />
        </div>

        <div className="order-2 pr-5 mobile:order-3 mobile:pr-0">
          {!isAuthenticated && <LoginButton />}
          {isAuthenticated && user && (
            <UserProfileMenu profileImage={user.profileImage} name={user.name} />
          )}
        </div>
      </div>
    </header>
  );
}
