'use client';

import { useState, Fragment, type CSSProperties } from 'react';
import Image from 'next/image';
import { Carousel } from '@/components/carousel';
import { SectionIntro } from '@/components/section-intro';
import { solutions, type SolutionCard } from '@/lib/content';
import { cn } from '@/lib/utils';
import vectors from '@/design/vectors.json';

/**
 * The heading glyphs, the two wordmarks and the Atlas rings are flattened
 * VECTOR nodes. scripts/fig-extract.mjs now decodes their commandsBlob into
 * real SVG paths under public/vectors, so these are the artboard's own
 * drawings rather than the lucide and type stand-ins that were here before.
 * Sizes come from design/vectors.json so they cannot drift from the export.
 */
const art = (name: string) => vectors[name as keyof typeof vectors];

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
    '--mark-w': 341,
    '--mark-h': 35,
    '--headline': 56,
    '--headline-lh': 0.964, // Bebas 56/54
    '--headline-mt': 31,
    '--blurb-mt': 9,
    '--cta-w': 225,
    '--stories-t': 39,
    '--stories-b': 116, // the strip Atlas overlaps
    '--strip-mt': 36,
    '--quote': 24,
    // 402 artboard
    '--m-top': 83,
    '--m-mark': 27,
    '--m-headline-mt': 24,
    '--m-cta-w': 177,
  } as CSSProperties,
  atlas: {
    '--panel-y': 67.29,
    '--panel-h': 491.71,
    '--tag-x': 28,
    '--tag-y': 25.71,
    '--text-b': 75,
    '--mark-w': 212.995,
    '--mark-h': 85.925,
    '--headline': 50,
    '--headline-lh': 1,
    '--headline-mt': 19.36,
    '--blurb-mt': 8,
    '--cta-w': 175,
    '--stories-t': 49,
    '--stories-b': 34,
    '--strip-mt': 40,
    '--quote': 22,
    '--m-top': 65,
    '--m-mark': 48,
    '--m-headline-mt': 21,
    '--m-cta-w': 153,
  } as CSSProperties,
};

export function Solutions() {
  const [sector, setSector] = useState(solutions.sectors[0].id);

  return (
    <section id="solutions" className="section-y bg-surface">
      <div className="container-page">
        <SectionIntro title={solutions.title} tracking="tracking-[0.05em]">
          <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <p className="font-sans text-[18px] leading-[27px] font-medium text-heading/70 uppercase lg:text-card-title lg:leading-[1.5]">
              {solutions.selectorLabel}
            </p>
            <div className="flex gap-[13px] lg:gap-5">
              {solutions.sectors.map((s) => {
                const active = s.id === sector;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSector(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'tracked inline-flex h-[35px] w-[174px] items-center justify-center gap-2.5 rounded-full font-mono text-[14px] text-white transition-colors lg:h-[42px] lg:w-[160px] lg:text-label',
                      active
                        // Flat pink on mobile; the gradient and the dot are
                        // desktop-only in the artboard.
                        ? 'bg-accent-2 lg:bg-linear-to-r lg:from-[#f21d63] lg:to-[#ed1a5e]'
                        : 'bg-slate hover:brightness-110'
                    )}
                  >
                    {active && <span className="hidden size-[13px] rounded-full bg-white lg:block" />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </SectionIntro>

        {/* solutions-rig is the container --k measures against, and the two
            cards overlap by 116 artboard units inside it. */}
        {/* Full bleed on mobile: the artboard's cards are the full 402 wide,
            which also makes 100cqw the artboard width for --k. */}
        <div className="solutions-rig mx-[calc(var(--gutter)*-1)] mt-[52px] flex flex-col lg:mx-0">
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
  const mark = art(`wordmark-${card.id}`);

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

      {/* ---------- intro ----------
          Desktop: copy bottom-aligned with the panel flush to the right edge.
          Mobile: copy first, then the panel full width beneath it. Both are
          driven from .card-intro in globals.css. */}
      <div className="card-intro relative">
        <div
          className="card-intro-text"
          style={
            {
              '--mark-ow': mark.w,
              '--mark-oh': mark.h,
              '--mark-dx': mark.bleed.x,
              '--mark-dy': mark.bleed.y,
            } as CSSProperties
          }
        >
          <span className="card-wordmark block">
            {/* eslint-disable-next-line @next/next/no-img-element -- a flat
                artboard vector; next/image would only add a request wrapper. */}
            <img src={`/vectors/wordmark-${card.id}.svg`} alt={card.eyebrow} className="h-full w-auto" />
          </span>

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
        <div
          className={cn(
            'card-panel relative border shadow-preview backdrop-blur-[4px]',
            dark
              ? 'border-[#373b49] bg-[#020716]/60'
              : 'border-[#bcecd4] bg-white/85 dark:border-white/50 dark:bg-[#d6dced]'
          )}
        >
          <span
            className={cn(
              'card-tag tracked absolute inline-flex items-center border font-mono-alt whitespace-nowrap',
              dark
                ? 'border-accent bg-accent/[0.17] text-white'
                : 'border-accent bg-accent/[0.09] text-accent dark:text-white'
            )}
          >
            {card.badge}
          </span>
        </div>

      </div>

      {/* ---------- green band ---------- */}
      <div className="card-band relative bg-green">
        <div className="card-cases flex flex-col lg:flex-row lg:items-start">
          {card.features.map((feature, i) => {
            const icon = art(`icon-${card.id}-${i + 1}`);
            return (
              <Fragment key={feature.title}>
                {i > 0 && (
                  <span aria-hidden className="card-case-rule shrink-0 bg-white/40" />
                )}
                <div className="card-col flex flex-col gap-[30px] lg:flex-1">
                  <div className="card-col-head flex items-start gap-[11px]">
                    <span className="card-numbox grid size-[52px] shrink-0 place-items-center rounded-[45px] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
                      <img
                        src={`/vectors/icon-${card.id}-${i + 1}.svg`}
                        alt=""
                        style={{ '--iw': icon.w, '--ih': icon.h } as CSSProperties}
                        className="card-icon size-6 object-contain"
                      />
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
      <div className="card-stories relative">
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
  // As shares of the group box: the 402 artboard steps by (52.72, 29.75)
  // inside a 661.94x474.12 group, which is the same figure at 0.554 scale.
].map(([x, y]) => [(x / 1195.25) * 100, (y / 856.1) * 100]);

function Motif() {
  return (
    <div aria-hidden className="card-motif pointer-events-none">
      <div className="card-motif-group">
        {MOTIF.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Atlas "BG Element": a 1046.97 square rotated 45deg that CLIPS a 1776.65
 * ring vector rotated back -45deg. The clip is the whole point — it is what
 * confines the rings to the intro instead of letting them run the height of
 * the card, and the site was drawing them unclipped.
 *
 * The rings themselves are the artboard's own vector, roughly forty tightly
 * spaced circles with a #4baf8e stroke fading in towards the lower right —
 * not the six-ring approximation that was here before.
 */
function Rings() {
  return (
    <div aria-hidden className="card-rings pointer-events-none">
      <div className="card-rings-node">
        {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
        <img src="/vectors/atlas-rings.svg" alt="" />
      </div>
    </div>
  );
}
