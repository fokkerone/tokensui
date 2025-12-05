import { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
//import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { CommandMenu } from '@/components/command-menu';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ThemeToggleButton, useThemeTransition } from './ui/theme-toggle';

// Custom hook to fetch GitHub stars

export function SiteHeader() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { startTransition } = useThemeTransition();

  const handleThemeToggle = useCallback(() => {
    const newMode = theme === 'dark' ? 'light' : 'dark';

    startTransition(() => {
      setTheme(newMode);
    });
  }, [theme, setTheme, startTransition]);

  return (
    <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 dark:border-border">
      <div
        className={cn(
          'flex h-16 items-center justify-between gap-4',
          pathname.includes('blocks') ? 'container-fluid' : 'container',
        )}
      >
        <MobileNav />

        <div className="hidden lg:flex items-center gap-3.5">
          <Link href="/" className="mr-10 font-extrabold flex items-center gap-2 text-sm">
            TO/UI
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <div className="hidden md:block">
            <CommandMenu />
          </div>

          <nav className="flex items-center gap-1">
            <ThemeToggleButton
              theme={theme as 'light' | 'dark'}
              onClick={handleThemeToggle}
              variant="polygon"
              start="center"
            />
          </nav>
        </div>
      </div>
    </header>
  );
}
