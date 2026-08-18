'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Horizontal scroller with arrow controls. Scroll-snap does the work; the
 * arrows just page by roughly one viewport. No carousel dependency — the design
 * only needs "nudge left / nudge right", and native overflow scrolling already
 * gives touch, trackpad and keyboard behaviour for free.
 */
export function Carousel({
  children,
  className,
  trackClassName,
  arrowClassName,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  arrowClassName?: string;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    // 1px of slack: sub-pixel widths otherwise leave the end permanently unreached.
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className={cn('relative', className)}>
      <div
        ref={track}
        onScroll={sync}
        role="group"
        aria-label={label}
        tabIndex={0}
        className={cn(
          'flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          trackClassName
        )}
      >
        {children}
      </div>

      <Arrow side="left" disabled={atStart} onClick={() => page(-1)} className={arrowClassName} label={`${label}: previous`} />
      <Arrow side="right" disabled={atEnd} onClick={() => page(1)} className={arrowClassName} label={`${label}: next`} />
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
