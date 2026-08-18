'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Carousel } from '@/components/carousel';
import { SectionIntro } from '@/components/section-intro';
import { solutions, type SolutionCard } from '@/lib/content';
import { cn } from '@/lib/utils';

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

        <div className="mt-[52px] flex flex-col gap-[42px]">
          {solutions.cards.map((card) => (
            <SolutionBlock key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * "Group 5" from the Playmakers card — ten 328.43px squares stepping by roughly
 * (96, 60) across a 1195x856 group that sits at (169, -321) in the 1350-wide
 * card, so it runs off the top edge and is clipped by the card's rounding.
 * Positions below are the artboard offsets as a share of the group, so the
 * whole motif scales with the card instead of drifting at other widths.
 */
const MOTIF = [
  [0, 0],
  [95, 54],
  [192, 114],
  [288, 174],
  [385, 234],
  [482, 294],
  [578, 354],
  [675, 414],
  [771, 474],
  [867, 528],
].map(([x, y]) => [(x / 1195.25) * 100, (y / 856.1) * 100]);

function CardMotif() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-[12.5%] aspect-[1195/856] w-[88.5%] -translate-y-[37.5%]
                 [mask-image:linear-gradient(160deg,#000_15%,transparent_78%)]"
    >
      {MOTIF.map(([left, top], i) => (
        <span
          key={i}
          style={{ left: `${left}%`, top: `${top}%` }}
          className="absolute aspect-square w-[27.5%] border border-[#ed1a5e]/35"
        />
      ))}
    </div>
  );
}

function SolutionBlock({ card }: { card: SolutionCard }) {
  // Playmakers is the dark card, Atlas the white one.
  const dark = card.id === 'playmakers';

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[20px] shadow-panel',
        dark
          ? 'noise [--noise-alpha:0.09] bg-linear-to-b from-card-dark-from to-card-dark-to'
          : 'bg-card-light'
      )}
    >
      {dark && <CardMotif />}

      {/* Intro: wordmark, headline, blurb, CTA + the app preview panel. */}
      <div className="card-p relative flex flex-col gap-10 lg:flex-row lg:gap-[58px]">
        <div className="lg:w-[545px] lg:shrink-0">
          <span
            className={cn(
              'inline-flex h-[32px] items-center rounded-[7px] border px-5 font-mono-alt text-mono-eyebrow tracking-[0.1em]',
              dark ? 'border-accent bg-accent/[0.17] text-white' : 'border-accent bg-accent/[0.09] text-accent-2'
            )}
          >
            {card.badge}
          </span>

          {/* ponytail: the design draws both wordmarks as vector logotypes, which
              the .fig does not expose as images. Set in type for now — swap in an
              SVG when the brand files are available. */}
          <p
            className={cn(
              'mt-6 font-sans leading-none font-bold',
              dark ? 'text-[34px] tracking-[0.02em] text-white uppercase' : 'text-[44px] tracking-[-0.02em] text-black lowercase'
            )}
          >
            {card.eyebrow}
          </p>

          <h3 className="tracked mt-6 font-display text-card leading-[0.96] whitespace-pre-line text-green uppercase">
            {card.title}
          </h3>

          <p
            className={cn(
              'mt-5 max-w-[514px] font-sans text-body leading-[1.72]',
              dark ? 'text-white/70' : 'text-black/70'
            )}
          >
            {card.blurb}
          </p>

          <button
            type="button"
            className={cn(
              'tracked mt-8 inline-flex h-[42px] items-center justify-center rounded-full px-6 font-mono text-label transition-opacity hover:opacity-85',
              dark ? 'bg-white text-black' : 'bg-black text-white'
            )}
          >
            {card.cta}
          </button>
        </div>

        {/* App preview panel — an empty inset in the design. */}
        <div
          aria-hidden
          className={cn(
            'min-h-[240px] flex-1 rounded-[20px] border shadow-preview backdrop-blur-[4px] lg:min-h-[478px]',
            dark ? 'border-[#373b49] bg-[#020716]/60' : 'border-black/10 bg-[#f4f6fb]'
          )}
        />
      </div>

      {/* Feature columns on the green band. */}
      <div className="card-p bg-green">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-[51px]">
          {card.features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn('flex flex-col gap-[30px]', i > 0 && 'lg:border-l lg:border-white/40 lg:pl-[51px]')}
            >
              <div className="flex items-start gap-[11px]">
                <span className="grid size-[52px] shrink-0 place-items-center rounded-[45px] bg-white font-display text-[24px] leading-none text-green">
                  {i + 1}
                </span>
                <h4 className="font-sans text-feature leading-[1.25] font-medium whitespace-pre-line text-white">
                  {feature.title}
                </h4>
              </div>

              <ul className="flex flex-col gap-5">
                {feature.points.map((point) => (
                  <li key={point} className="flex gap-[18px]">
                    <span aria-hidden className="mt-2 size-[10px] shrink-0 rounded-[3px] border border-white/70" />
                    <span className="font-sans text-body leading-[1.56] font-medium whitespace-pre-line text-white/90">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials. */}
      <div className={'card-p'}>
        <p
          className={cn(
            'tracked text-center font-mono text-label',
            dark ? 'text-[#e6e6ff]/70' : 'font-mono-alt text-navy'
          )}
        >
          {card.testimonialsLabel}
        </p>

        <Carousel
          label={card.testimonialsLabel}
          className="mt-6"
          trackClassName="gap-8"
          arrowClassName={dark ? 'text-white/70' : undefined}
        >
          {card.testimonials.map((t, i) => (
            <figure
              key={i}
              className={cn(
                'w-full shrink-0 snap-start px-8 text-center lg:w-1/2',
                // 228px hairline between the two stories, per the design's
                // "Story Strip" divider.
                i > 0 && 'lg:border-l lg:border-[#6b6b6b]/50'
              )}
            >
              <blockquote
                className={cn(
                  'font-sans text-quote leading-[1.4] font-medium',
                  dark ? 'text-white' : 'text-[#2e2e2e]'
                )}
              >
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-center gap-3">
                <Image src={t.avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                <span
                  className={cn(
                    'text-left font-mono-alt text-[15px] leading-[1.3]',
                    dark ? 'text-white/80' : 'text-black'
                  )}
                >
                  <span className="block font-bold">{t.name}</span>
                  <span className="block opacity-70">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </div>
    </article>
  );
}
