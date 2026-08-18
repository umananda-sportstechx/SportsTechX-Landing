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
    <section id="solutions" className="bg-surface py-[70px] lg:py-[100px]">
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

function SolutionBlock({ card }: { card: SolutionCard }) {
  // Playmakers is the dark card, Atlas the white one.
  const dark = card.id === 'playmakers';

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[20px]',
        dark ? 'bg-linear-to-b from-card-dark-from to-card-dark-to' : 'bg-card-light'
      )}
    >
      {/* Intro: wordmark, headline, blurb, CTA + the app preview panel. */}
      <div className="flex flex-col gap-10 p-[30px] lg:flex-row lg:gap-[58px] lg:p-[58px]">
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
            'min-h-[240px] flex-1 rounded-[20px] border lg:min-h-[478px]',
            dark ? 'border-[#373b49] bg-[#020716]/60' : 'border-black/10 bg-[#f4f6fb]'
          )}
        />
      </div>

      {/* Feature columns on the green band. */}
      <div className="bg-green px-[30px] py-10 lg:px-[57px] lg:py-16">
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
      <div className={cn('px-[30px] py-10 lg:px-[58px] lg:py-[54px]')}>
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
            <figure key={i} className="w-full shrink-0 snap-start px-8 text-center lg:w-1/2">
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
