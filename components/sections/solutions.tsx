'use client';

import { useState, Fragment, type CSSProperties } from 'react';
import Image from 'next/image';
import {
  ChartColumnIncreasing,
  FileText,
  Handshake,
  Network,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Carousel } from '@/components/carousel';
import { SectionIntro } from '@/components/section-intro';
import { solutions, type SolutionCard } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * ponytail: the artboard draws each column heading's glyph as a flattened
 * VECTOR, and the .fig carries no path geometry for those — the decoder reads
 * their size and stroke but not their shape. These are semantic stand-ins at
 * the designed 24x24 / 1.5px, in the same bucket as the two wordmarks. Swap in
 * the real SVGs when the brand files land.
 */
const ICONS: Record<string, LucideIcon[]> = {
  playmakers: [Users, Network, ChartColumnIncreasing],
  atlas: [FileText, Search, Handshake],
};

/**
 * Per-card artboard constants, consumed by the .card-* rules in globals.css.
 * Unitless — each is multiplied by --k, one artboard unit.
 */
const VARS: Record<string, CSSProperties> = {
  playmakers: {
    '--panel-y': 65.47,
    '--panel-h': 478.45,
    '--tag-x': 25,
    '--tag-y': 24.53,
    '--text-b': 99.5,
    '--mark': 48,
    '--headline': 56,
    '--headline-lh': 0.964, // Bebas 56/54
    '--headline-mt': 31,
    '--blurb-mt': 9,
    '--cta-w': 225,
    '--stories-t': 39,
    '--stories-b': 116, // the strip Atlas overlaps
    '--strip-mt': 36,
    '--quote': 24,
  } as CSSProperties,
  atlas: {
    '--panel-y': 67.29,
    '--panel-h': 491.71,
    '--tag-x': 28,
    '--tag-y': 25.71,
    '--text-b': 75,
    '--mark': 72,
    '--headline': 50,
    '--headline-lh': 1,
    '--headline-mt': 19.36,
    '--blurb-mt': 8,
    '--cta-w': 175,
    '--stories-t': 49,
    '--stories-b': 34,
    '--strip-mt': 40,
    '--quote': 22,
  } as CSSProperties,
};

export function Solutions() {
  const [sector, setSector] = useState(solutions.sectors[0].id);

  return (
    <section id="solutions" className="section-y bg-surface">
      <div className="container-page">
        <SectionIntro title={solutions.title} tracking="tracking-[0.05em]">
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-sans text-card-title leading-[1.5] font-medium text-heading/70 uppercase">
              {solutions.selectorLabel}
            </p>
            <div className="flex gap-5">
              {solutions.sectors.map((s) => {
                const active = s.id === sector;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSector(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'tracked inline-flex h-[42px] w-[160px] items-center justify-center gap-2.5 rounded-full font-mono text-label text-white transition-colors',
                      active
                        ? 'bg-linear-to-r from-[#f21d63] to-[#ed1a5e]'
                        : 'bg-slate hover:brightness-110'
                    )}
                  >
                    {active && <span className="size-[13px] rounded-full bg-white" />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionIntro>

        {/* solutions-rig is the container --k measures against, and the two
            cards overlap by 116 artboard units inside it. */}
        <div className="solutions-rig mt-[52px] flex flex-col gap-10 lg:gap-0">
          {solutions.cards.map((card) => (
            <SolutionBlock key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionBlock({ card }: { card: SolutionCard }) {
  // Playmakers is the dark card, Atlas the pale one.
  const dark = card.id === 'playmakers';
  const icons = ICONS[card.id];

  return (
    <article
      style={VARS[card.id]}
      className={cn(
        'solution-card relative overflow-hidden rounded-[20px] shadow-panel',
        dark
          ? 'noise [--noise-alpha:0.5] bg-linear-to-b from-card-dark-from to-card-dark-to'
          : 'bg-card-light'
      )}
    >
      {dark ? <Motif /> : <Rings />}

      {/* ---------- intro: panel flush right, copy bottom-aligned ---------- */}
      <div className="card-intro card-p relative flex flex-col gap-8 lg:block lg:p-0">
        <div
          className={cn(
            'card-panel relative order-first min-h-[210px] rounded-[20px] border shadow-preview backdrop-blur-[4px] lg:order-none',
            dark
              ? 'border-[#373b49] bg-[#020716]/60'
              : 'border-[#bcecd4] bg-white/85 dark:border-white/50 dark:bg-[#d6dced]'
          )}
        >
          <span
            className={cn(
              'card-tag tracked absolute top-4 left-4 inline-flex h-8 items-center rounded-[7px] border px-5 font-mono-alt text-[13px] whitespace-nowrap',
              dark
                ? 'border-accent bg-accent/[0.17] text-white'
                : 'border-accent bg-accent/[0.09] text-accent dark:text-white'
            )}
          >
            {card.badge}
          </span>
        </div>

        <div className="card-intro-text">
          {/* ponytail: both wordmarks are vector logotypes the .fig does not
              expose as images. Set in type at the designed box size. */}
          <p
            className={cn(
              'card-wordmark font-sans leading-none font-bold',
              dark
                ? 'text-[28px] tracking-[0.02em] text-white uppercase'
                : 'text-[40px] tracking-[-0.02em] text-black lowercase'
            )}
          >
            {card.eyebrow}
          </p>

          <h3
            className={cn(
              'card-headline tracked mt-6 font-display text-card leading-[0.96] whitespace-pre-line',
              dark ? 'text-green dark:text-green-2' : 'text-[#22785b] dark:text-green-2'
            )}
          >
            {card.title}
          </h3>

          <p
            className={cn(
              'card-blurb mt-5 max-w-[514px] font-sans text-body leading-[1.72]',
              dark ? 'text-white/70' : 'text-black/60'
            )}
          >
            {card.blurb}
          </p>

          <button
            type="button"
            className={cn(
              'card-cta tracked mt-8 inline-flex h-[42px] items-center justify-center rounded-full px-6 text-label transition-opacity hover:opacity-85',
              dark ? 'bg-white font-mono text-black' : 'bg-black font-mono-alt text-white'
            )}
          >
            {card.cta}
          </button>
        </div>
      </div>

      {/* ---------- green band ---------- */}
      <div className="card-band card-p relative bg-green">
        <div className="card-cases grid gap-10 lg:flex lg:items-start">
          {card.features.map((feature, i) => {
            const Icon = icons[i];
            return (
              <Fragment key={feature.title}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="card-case-rule hidden w-px shrink-0 bg-white/40 lg:block"
                  />
                )}
                <div className="card-col flex flex-col gap-[30px] lg:flex-1">
                  <div className="card-col-head flex items-start gap-[11px]">
                    <span className="card-numbox grid size-[52px] shrink-0 place-items-center rounded-[45px] bg-white">
                      <Icon className="size-6 text-black" strokeWidth={1.5} />
                    </span>
                    <h4 className="card-col-title font-sans text-feature leading-[1.25] font-medium whitespace-pre-line text-white">
                      {feature.title}
                    </h4>
                  </div>

                  <ul className="card-uses flex flex-col gap-5">
                    {feature.points.map((point) => (
                      <li key={point} className="card-use flex gap-[18px]">
                        <span
                          aria-hidden
                          className="card-bullet mt-2 size-[10px] shrink-0 border border-white/70"
                        />
                        <span className="font-sans text-body leading-[1.56] font-medium whitespace-pre-line text-white/90">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* ---------- testimonials ---------- */}
      <div className="card-stories card-p relative">
        <p
          className={cn(
            'card-stories-label tracked text-center text-label',
            dark ? 'font-mono text-[#e6e6ff]/70' : 'font-mono-alt text-navy'
          )}
        >
          {card.testimonialsLabel}
        </p>

        <div className="card-strip relative mt-6">
          {/* 228-tall hairline between the two stories, top-aligned with them. */}
          <span
            aria-hidden
            className="card-story-rule absolute top-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#6b6b6b]/25 lg:block"
          />
          <Carousel
            label={card.testimonialsLabel}
            trackClassName="gap-0"
            arrowClassName={cn('card-arrow', dark ? 'text-white' : 'text-[#606060]')}
          >
            {card.testimonials.map((t, i) => (
              <figure
                key={i}
                className="flex w-full shrink-0 snap-start flex-col items-center px-8 text-center lg:w-1/2"
              >
                <blockquote
                  className={cn(
                    'card-quote font-sans text-quote leading-[1.4]',
                    dark ? 'text-[#eeeeee]' : 'text-[#2e2e2e]'
                  )}
                >
                  {t.quote}
                </blockquote>
                <figcaption className="card-chip mt-6 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt=""
                    width={56}
                    height={56}
                    className="card-avatar size-14 rounded-[3px] object-cover"
                  />
                  <span
                    className={cn(
                      'card-chip-text tracked text-left font-mono-alt text-[15px] leading-[1.27]',
                      dark ? 'text-white' : 'text-black'
                    )}
                  >
                    <span className="block">{t.name}</span>
                    <span className="block">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </div>
      </div>
    </article>
  );
}

/**
 * "Frame 6" > "Group 5": ten 328.43 squares stepping by (96.58, 60.05) inside
 * a group rotated 15deg. The site drew the steps but dropped the rotation, so
 * the ribbon sat flat instead of raked across the card.
 */
const MOTIF = [
  [0, 0],
  [95.2, 53.72],
  [191.78, 113.76],
  [288.36, 173.81],
  [384.94, 233.85],
  [481.52, 293.89],
  [578.1, 353.93],
  [674.68, 413.98],
  [771.26, 474.02],
  [866.82, 527.67],
];

function Motif() {
  return (
    <div aria-hidden className="card-motif pointer-events-none hidden lg:block">
      <div className="card-motif-group">
        {MOTIF.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            style={{ left: `calc(${x}*var(--k))`, top: `calc(${y}*var(--k))` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Atlas "BG Element": a 1776.65 square of concentric rings whose 45deg frame
 * and -45deg child cancel out, leaving it axis-aligned at (12.6, -501.2). The
 * stroke is a #4baf8e gradient running transparent to solid towards the lower
 * right.
 *
 * ponytail: the .fig stores the rings as one flattened VECTOR, so their exact
 * count and radii are not recoverable — six evenly spaced approximates the
 * drawn motif.
 */
function Rings() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1776.65 1776.65"
      className="card-rings pointer-events-none hidden lg:block"
    >
      <defs>
        <linearGradient id="atlas-ring" x1="0.30" y1="0.393" x2="0.85" y2="0.687">
          <stop offset="0" stopColor="#4baf8e" stopOpacity="0" />
          <stop offset="1" stopColor="#4baf8e" stopOpacity="1" />
        </linearGradient>
      </defs>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <circle
          key={n}
          cx="888.325"
          cy="888.325"
          r={(888.325 * n) / 6}
          fill="none"
          stroke="url(#atlas-ring)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
