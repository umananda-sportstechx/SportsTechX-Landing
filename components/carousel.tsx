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
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

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
      if (paused.current) {
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
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const hold = (on: boolean) => () => {
    paused.current = on;
  };

  return (
    <div className={cn('relative', className)}>
      <div
        ref={track}
        onScroll={sync}
        onPointerEnter={hold(true)}
        onPointerLeave={hold(false)}
        onFocusCapture={hold(true)}
        onBlurCapture={hold(false)}
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

      <Arrow side="left" disabled={!autoScroll && atStart} onClick={() => page(-1)} className={arrowClassName} label={`${label}: previous`} />
      <Arrow side="right" disabled={!autoScroll && atEnd} onClick={() => page(1)} className={arrowClassName} label={`${label}: next`} />
    </div>
  );
}

function Arrow({
  side,
  disabled,
  onClick,
  className,
  label,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
  className?: string;
  label: string;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'absolute top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center text-[#606060] transition-opacity',
        'hover:opacity-70 disabled:pointer-events-none disabled:opacity-25 dark:text-fg-muted',
        side === 'left' ? 'left-0 lg:-left-[22px]' : 'right-0 lg:-right-[22px]',
        className
      )}
    >
      <Icon className="size-9" strokeWidth={1.5} />
    </button>
  );
}
