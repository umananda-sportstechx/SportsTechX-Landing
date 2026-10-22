'use client';

import { useEffect, useRef } from 'react';
import { NewsletterForm } from '@/components/newsletter-form';

/**
 * The newsletter sign-up dialog. Opens when anything dispatches
 * `stx:newsletter-open` (the nav CTA does). Native <dialog> gives the focus
 * trap, the backdrop and Escape-to-close for free; the only JS is wiring the
 * open event and dismissing on a backdrop click. The open/close animation and
 * the backdrop blur live in globals.css under `.newsletter-dialog`.
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
      className="newsletter-dialog m-auto w-[min(94vw,520px)] overflow-hidden rounded-[24px] border border-white/10 bg-surface p-0 text-fg shadow-panel"
    >
      <div className="relative flex flex-col gap-7 p-8 sm:p-10">
        {/* A soft pink glow bleeding in from the top-left corner, so the card
            reads as branded rather than a plain grey sheet. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-56 rounded-full bg-accent-2/20 blur-3xl"
        />

        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-6 top-6 z-10 grid size-9 place-items-center rounded-full border border-white/10 text-heading/60 transition-colors hover:border-white/20 hover:text-heading"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        </button>

        <div className="relative flex flex-col gap-3 pr-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent-2">
            Newsletter
          </span>
          <h2 className="font-display text-[34px] leading-[1.02] text-heading uppercase tracking-[0.02em] sm:text-[40px]">
            Join the inside track
          </h2>
          <p className="max-w-[40ch] font-sans text-body leading-[1.6] text-heading/70">
            Insider sports tech &amp; venture, straight to your inbox — the people, insights and capital shaping the industry.
          </p>
        </div>

        <div className="relative flex flex-col gap-3">
          <NewsletterForm tone="modal" autoFocus />
          <p className="px-[18px] font-sans text-body-sm text-heading/45">
            Join 20,000+ founders, investors and operators. No spam — unsubscribe anytime.
          </p>
        </div>
      </div>
    </dialog>
  );
}
