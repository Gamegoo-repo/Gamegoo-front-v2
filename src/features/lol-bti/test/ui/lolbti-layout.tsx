import { FlexBox } from '@/shared/ui/flexbox';

interface LolBtiLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'result';
}

export function LolBtiLayout({ children, variant = 'default' }: LolBtiLayoutProps) {
  const mainClassName =
    variant === 'result'
      ? 'w-full flex-1'
      : 'w-full flex-1 bg-[linear-gradient(153deg,var(--color-blue-10,#0F0F23)_0%,var(--color-blue-14,#1A1A2E)_50%,var(--color-azure-16,#16213E)_100%)] flex flex-col items-center';
  return (
    <div className="h-screen min-h-screen w-screen overflow-y-auto bg-[#111]">
      <FlexBox direction="column" align="center" className="mx-auto h-full w-full mobile:w-[440px]">
        <main className={mainClassName}>{children}</main>
        <footer className="w-full border-t border-white/5 px-6 py-4 text-xs text-[#7A7A7A]">
          <p className="text-center">
            롤BTI (League of Legends Battle Type Indicator)
            <br />© 2025. GAMEGOO All rights reserved.
          </p>
        </footer>
      </FlexBox>
    </div>
  );
}
