'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Horizontal scroller with arrow controls, and an optional continuous drift.
 *
 * Scroll-snap does the work for manual use; the arrows page by roughly one
 * viewport. No carousel dependency — native overflow scrolling already gives
 * touch, trackpad and keyboard behaviour for free.
 *
 * With `autoScroll` the children are rendered twice and the scroll position
 * wraps at the halfway mark, which is what makes the loop seamless. Snap and
 * CSS smooth-scrolling are switched off in that mode: snap would keep yanking
 * the track back to a card edge, and `scroll-behavior: smooth` would animate
 * every one of the ~60 tiny writes a second. Drift pauses on hover and on focus
 * so it can't fight someone reading or tabbing through, and never starts at all
 * under `prefers-reduced-motion`.
 */
const DRIFT_PX_PER_SEC = 24;

export function Carousel({
  children,
  className,
  trackClassName,
  arrowClassName,
  label,
  autoScroll,
  initialOffset = 0,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  arrowClassName?: string;
  label: string;
  /** 'ltr' drifts the cards left-to-right, 'rtl' the other way. */
  autoScroll?: 'ltr' | 'rtl';
  /** Starting scroll position, used for the artboard's staggered second row. */
  initialOffset?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const resumeAt = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el || autoScroll) return; // the looping track has no start or end
    setAtStart(el.scrollLeft <= 1);
    // 1px of slack: sub-pixel widths otherwise leave the end permanently unreached.
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, [autoScroll]);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  useEffect(() => {
    const el = track.current;
    if (!el || !autoScroll) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.scrollLeft = initialOffset || 1;
    const dir = autoScroll === 'ltr' ? -1 : 1;
    let raf = 0;
    let last = performance.now();
    // The position is accumulated here rather than read back from scrollLeft
    // each frame. At 24px/s a frame advances only 0.4px, and the browser rounds
    // the stored scroll offset — so reading it back re-quantised the value to
    // the same integer every frame and the track never moved at all.
    let pos = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000; // clamp after a background tab
      last = now;
      // data-swapping: the theme ripple is snapshotting the page, and scroll
      // writes during that are pure cost — see theme-toggle.tsx.
      if (paused.current || document.documentElement.hasAttribute('data-swapping')) {
        pos = el.scrollLeft; // pick up wherever the arrows or a drag left it
      } else {
        const half = el.scrollWidth / 2;
        pos += dir * DRIFT_PX_PER_SEC * dt;
        if (pos <= 0) pos += half;
        else if (pos >= half) pos -= half;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll, initialOffset]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // The drift rewrites scrollLeft every frame, so a smooth scroll started here
    // was overwritten before it could travel — the arrows did nothing on the
    // auto-scrolling rows. Hold the drift while the scroll settles; the loop
    // resyncs its accumulator from the real position on the way out.
    paused.current = true;
    if (resumeAt.current) window.clearTimeout(resumeAt.current);
    const delta = dir * el.clientWidth * 0.8;
    if (autoScroll) {
      // The track carries two copies, so jumping by exactly one is invisible.
      // Without this a page near either end just clamped: row 2 sits low in its
      // range, and its left arrow travelled 342px of a 1089px page before
      // hitting scrollLeft 0.
      const half = el.scrollWidth / 2;
      if (el.scrollLeft + delta < 0) el.scrollLeft += half;
      else if (el.scrollLeft + delta > el.scrollWidth - el.clientWidth) el.scrollLeft -= half;
    }
    el.scrollBy({ left: delta, behavior: 'smooth' });
    resumeAt.current = window.setTimeout(() => {
      paused.current = false;
    }, 800);
  };

  // Plain callbacks rather than a curried hold(true) factory: that factory was
  // *called* during render, so react-hooks/refs flagged it as a ref access in
  // the render pass even though the write itself only happens on the event.
  const pause = useCallback(() => {
    paused.current = true;
  }, []);
  const resume = useCallback(() => {
    paused.current = false;
  }, []);

  useEffect(() => () => {
    if (resumeAt.current) window.clearTimeout(resumeAt.current);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={track}
        onScroll={sync}
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        role="group"
        aria-label={label}
        tabIndex={0}
        className={cn(
          'flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          autoScroll ? 'overscroll-x-contain' : 'snap-x snap-mandatory scroll-smooth',
          trackClassName
        )}
      >
        {children}
        {/* Second pass makes the wrap seamless; hidden from assistive tech. */}
        {autoScroll && (
          <div className="contents" aria-hidden>
            {children}
          </div>
        )}
      </div>

      {/* Both ends at once means the content already fits, so there is nowhere
          to page — show no affordance rather than two dead arrows. The card
          testimonials hit this whenever the design's two stories both fit. */}
      {!(atStart && atEnd && !autoScroll) && (
        <>
      <Arrow side="left" disabled={!autoScroll && atStart} onClick={() => page(-1)} onHold={pause} onRelease={resume} className={arrowClassName} label={`${label}: previous`} />
      <Arrow side="right" disabled={!autoScroll && atEnd} onClick={() => page(1)} onHold={pause} onRelease={resume} className={arrowClassName} label={`${label}: next`} />
        </>
      )}
    </div>
  );
}

function Arrow({
  side,
  disabled,
  onClick,
  onHold,
  onRelease,
  className,
  label,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
  onHold: () => void;
  onRelease: () => void;
  className?: string;
  label: string;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={onHold}
      onPointerLeave={onRelease}
      onFocus={onHold}
      onBlur={onRelease}
      disabled={disabled}
      aria-label={label}
      // The artboard's chevrons are 16x36.7 at 1.5px, set ~35px clear of the
      // row. Sized up to match and pushed off the track; the offset eases back
      // below xl, where the page gutter is too narrow to hold it.
      className={cn(
        'absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center text-[#606060] transition-opacity',
        'hover:opacity-70 disabled:pointer-events-none disabled:opacity-25 dark:text-fg-muted',
        side === 'left' ? '-left-1 lg:-left-[42px] xl:-left-[52px]' : '-right-1 lg:-right-[42px] xl:-right-[52px]',
        className
      )}
    >
      <Icon className="size-12" strokeWidth={1.5} />
    </button>
  );
}
