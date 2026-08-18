'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The "Nightmode switch" from the nav — 42x42, radius 99, a 44%-opacity white
 * disc in light mode, transparent in dark.
 *
 * Both icons are rendered and CSS picks one off `data-theme`. That avoids the
 * usual mounted-flag effect: the server has no way to know the stored theme, so
 * gating on state would either flash the wrong icon or need a setState in an
 * effect. `resolvedTheme` is only read inside the click handler, which never
 * runs before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Switch colour theme"
      className={cn(
        'grid size-[42px] shrink-0 place-items-center rounded-full',
        'bg-white/45 text-fg transition-colors hover:bg-white/70',
        'dark:bg-transparent dark:hover:bg-white/10',
        className
      )}
    >
      <Moon className="size-[18px] dark:hidden" strokeWidth={1.5} />
      <Sun className="hidden size-[18px] dark:block" strokeWidth={1.5} />
    </button>
  );
}
