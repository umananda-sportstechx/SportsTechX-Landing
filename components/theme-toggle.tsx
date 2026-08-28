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

const TIMING = { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  /**
   * The switch ripples: the incoming theme is clipped in through a circle grown
   * from the button to the furthest corner of the viewport.
   *
   * The geometry is handed to the pseudo-element by animating it directly with
   * the Web Animations API, as concrete pixel values. It used to travel as
   * custom properties on the root that the ::view-transition tree inherits,
   * which is a documented cross-engine weak spot: where that inheritance does
   * not happen the var() fallbacks take over and the circle silently opens from
   * the middle of the page instead of from the switch. Baking the numbers into
   * the keyframes removes the inheritance step, so there is nothing left to
   * fall back to.
   *
   * Where startViewTransition is missing there is no snapshot to clip, so the
   * incoming background sweeps in over the page instead — same gesture, no
   * reader is left with an abrupt swap. Only prefers-reduced-motion swaps flat.
   */
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const doc = document as WithViewTransition;
    const root = document.documentElement;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next);
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const grow: Keyframe[] = [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
    ];

    // Snapshotting the page is the expensive part, and on a high-density
    // display it is expensive enough that anything still animating underneath
    // shows up as jank. The orbit pills and the carousel drift sit out the
    // half-second; `data-swapping` is what both of them watch.
    root.setAttribute('data-swapping', '');
    const done = () => root.removeAttribute('data-swapping');

    if (typeof doc.startViewTransition !== 'function') {
      const wash = document.createElement('div');
      wash.className = 'theme-wash';
      wash.style.clipPath = grow[0].clipPath as string;
      root.append(wash);
      const sweep = wash.animate(grow, { duration: TIMING.duration, easing: TIMING.easing });
      sweep.finished
        .catch(() => {})
        .finally(() => {
          flushSync(() => setTheme(next));
          wash.remove();
          done();
        });
      return;
    }

    const transition = doc.startViewTransition(() => {
      // flushSync, not an awaited frame: rAF does not fire while the transition
      // is capturing, so awaiting one deadlocked the callback until Chrome's
      // 4s "timeout in DOM update" — which is what made every toggle drag.
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() =>
        root.animate(grow, { ...TIMING, pseudoElement: '::view-transition-new(root)' }).finished
      )
      // Toggling again mid-flight aborts the running transition and rejects its
      // promises; without this it surfaces as an unhandled rejection.
      .catch(() => {})
      .finally(done);

    transition.finished.catch(() => {});
    transition.updateCallbackDone.catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour theme"
      className={cn(
        'group/toggle grid size-[42px] shrink-0 place-items-center rounded-full',
        'bg-white/45 text-fg transition-colors hover:bg-white/70',
        'active:opacity-70',
        'dark:bg-transparent dark:hover:bg-white/10',
        className
      )}
    >
      {/* The board fills the glyph on hover rather than recolouring its stroke:
          transparent to #EC1E5F over 80ms. */}
      <Moon
        className="size-[18px] fill-transparent transition-[fill] duration-[80ms] ease-out group-hover/toggle:fill-accent dark:hidden"
        strokeWidth={1.5}
      />
      <Sun
        className="hidden size-[18px] fill-transparent transition-[fill] duration-[80ms] ease-out group-hover/toggle:fill-accent dark:block"
        strokeWidth={1.5}
      />
    </button>
  );
}
