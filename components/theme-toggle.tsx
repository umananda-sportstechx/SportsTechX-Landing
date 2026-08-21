'use client';

import { flushSync } from 'react-dom';
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
type ViewTransition = {
  ready: Promise<unknown>;
  finished: Promise<unknown>;
  updateCallbackDone: Promise<unknown>;
};
type WithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition;
};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  /**
   * The switch ripples: the incoming theme is clipped in through a circle grown
   * from the button to the furthest corner of the viewport.
   *
   * The origin and radius go on the root as custom properties because the
   * ::view-transition pseudo tree inherits from it — there is no other way to
   * hand geometry to those pseudo-elements. Where startViewTransition is
   * missing, or the reader asked for less motion, the theme just swaps.
   */
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const doc = document as WithViewTransition;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof doc.startViewTransition !== 'function') {
      setTheme(next);
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const root = document.documentElement;
    root.style.setProperty('--ripple-x', `${x}px`);
    root.style.setProperty('--ripple-y', `${y}px`);
    root.style.setProperty(
      '--ripple-r',
      `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`
    );

    // flushSync, not an awaited frame: rAF does not fire while the transition
    // is capturing, so awaiting one deadlocked the callback until Chrome's
    // 4s "timeout in DOM update" — which is what made every toggle drag.
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    // Toggling again mid-flight aborts the running transition and rejects its
    // promises; without these it surfaces as an unhandled rejection.
    transition.ready.catch(() => {});
    transition.finished.catch(() => {});
    transition.updateCallbackDone.catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
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
