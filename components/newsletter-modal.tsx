'use client';

import { useEffect, useRef } from 'react';
import { NewsletterForm } from '@/components/newsletter-form';

/**
 * The newsletter sign-up dialog. Opens when anything dispatches
 * `stx:newsletter-open` (the nav CTA does). Native <dialog> gives the focus
 * trap, the backdrop and Escape-to-close for free; the only JS is wiring the
 * open event and dismissing on a backdrop click.
 *
 * Mounted once in the root layout, so every page shares one instance.
 */
export function NewsletterModal() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const open = () => ref.current?.showModal();
    window.addEventListener('stx:newsletter-open', open);
    return () => window.removeEventListener('stx:newsletter-open', open);
  }, []);

  return (
    <dialog
      ref={ref}
      // Click outside the card (directly on the <dialog> backdrop) closes it.
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      className="m-auto w-[min(92vw,440px)] rounded-[20px] bg-surface p-0 text-fg shadow-panel backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative flex flex-col gap-5 p-7">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-heading/60 transition-colors hover:text-heading"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>

        <div className="flex flex-col gap-2 pr-8">
          <h2 className="font-display text-[26px] leading-[1.15] text-heading uppercase tracking-[0.03em]">
            Join the newsletter
          </h2>
          <p className="font-sans text-body-sm leading-[1.6] text-heading/70">
            Insider sports tech &amp; venture, in your inbox. The people, insights and capital shaping the industry.
          </p>
        </div>

        <NewsletterForm tone="modal" autoFocus />
      </div>
    </dialog>
  );
}
