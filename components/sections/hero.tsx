import Image from 'next/image';
import { NavBar } from '@/components/sections/nav-bar';
import { hero } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * The hero fills the viewport. It used to hold the artboard's 1512x1004 ratio,
 * which on a normal 1080p window is taller than the screen — so the motif and
 * the pills, which live in its bottom third, were simply never on screen.
 *
 * Everything inside is placed as a share of the frame, the way the artboard
 * does. The motif circle is 1586 across at (-36, 154) in a 1512x1004 hero, so
 * its centre is (757, 947): horizontally centred, 94.3% down, radius 79% of the
 * frame's height. Sizing it off the height rather than the width is what keeps
 * the composition intact when the frame is wider or shorter than the artboard.
 */
/**
 * The pills are not scattered — each sits ON one of the rings. Converting the
 * artboard positions to polar coordinates about the motif centre gives radii
 * that land on exactly two of the six circles:
 *   FOUNDERS 17.0% / INVESTORS 16.7%   -> innermost ring (270 dia = 17.0%)
 *   TEAMS 52.7% / ATHLETES 52.8% / LEAGUES 57.1% / MEDIA 57.5% -> 882 ring (55.6%)
 * `r` is a share of the motif radius, `a` the angle in degrees with y down.
 * `mr`/`ma` are the mobile overrides; the design drops MEDIA and ATHLETES there.
 */
const PILLS: Record<
  string,
  { r: number; a: number; mr?: number; ma?: number; dur: number; delay: number }
> = {
  LEAGUES: { r: 57.1, a: -25.4, mr: 40.9, ma: -45.0, dur: 21, delay: -3 },
  TEAMS: { r: 52.7, a: -157.0, mr: 45.5, ma: -135.8, dur: 24, delay: -11 },
  MEDIA: { r: 57.5, a: -173.4, dur: 19, delay: -6 },
  ATHLETES: { r: 52.8, a: -10.8, dur: 26, delay: -14 },
  FOUNDERS: { r: 17.0, a: -146.4, mr: 24.0, ma: -157.2, dur: 18, delay: 0 },
  INVESTORS: { r: 16.7, a: -9.3, mr: 26.4, ma: 4.6, dur: 22, delay: -8 },
};

export function Hero() {
  return (
    <section className="hero-frame relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-hero">
      {/* Epicentre motif, exported from Figma as a single SVG. Sized off the
          frame's height so the orbits keep their proportions at any viewport. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[var(--motif-cy)] left-1/2 -z-10 aspect-square h-[calc(var(--motif-r)*2)] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/icons/epicentre-motif.svg"
          alt=""
          fill
          priority
          className="object-contain dark:opacity-40 dark:invert dark:hue-rotate-180"
        />
      </div>

      {/* Nav sits at y=85 of the 1004 frame on the artboard. */}
      <div className="absolute inset-x-0 top-[3.5%] lg:top-[8.5%]">
        <NavBar />
      </div>

      <div className="absolute inset-x-0 top-[15%] flex flex-col items-center px-5 text-center lg:top-[22.3%] lg:px-0">
        <h1
          // max-width in em, not px, so the designed two-line break survives the
          // fluid type scale at every width.
          className="tracked max-w-[11em] font-display text-headline leading-[1.08] text-fg uppercase"
        >
          {hero.headline}
        </h1>

        <p className="mt-3 max-w-[648px] font-sans text-body-lg leading-[1.57] font-medium whitespace-pre-line text-fg-2">
          {hero.subhead}
        </p>

        <div className="mt-[26px] flex flex-col items-center gap-5 lg:flex-row lg:gap-[30px]">
          {hero.ctas.map((cta) => (
            <a
              key={cta.label}
              href={cta.href}
              className={cn(
                'tracked inline-flex h-[41px] w-[215px] items-center justify-center rounded-[93px] font-mono text-cta text-white',
                'shadow-cta transition-opacity hover:opacity-90 lg:h-[54px] lg:w-[249px]',
                cta.variant === 'primary' ? 'bg-accent-2' : 'bg-slate'
              )}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>

      {/* Category pills, rigged to travel along their orbit. The outer span is a
          zero-size anchor at the motif centre that rotates; the inner one is
          pushed out by the pill's radius and counter-rotates so the label stays
          upright. Both share one duration and delay so they never drift apart. */}
      {hero.pills.map((pill) => {
        const p = PILLS[pill.label];
        return (
          <span
            key={pill.label}
            style={
              {
                // share of the motif diameter, so r% of the radius is r/2 here
                '--r': `${(p.mr ?? p.r) / 2}%`,
                '--r-lg': `${p.r / 2}%`,
                '--a': `${p.ma ?? p.a}deg`,
                '--a-lg': `${p.a}deg`,
                '--dur': `${p.dur}s`,
                '--delay': `${p.delay}s`,
              } as React.CSSProperties
            }
            className={cn('orbit', !p.mr && 'hidden lg:block')}
          >
            <span className="orbit-pill" data-pill={pill.label}>
              <span
                className={cn(
                  'inline-flex h-[24px] items-center gap-[7px] rounded-full px-[14px] font-mono text-micro',
                  'shadow-pill tracking-[0.1em] whitespace-nowrap lg:h-[31px] lg:px-[22px]',
                  pill.primary
                    ? 'border-2 border-accent bg-white text-accent-2 dark:bg-surface'
                    : 'border-2 border-pill-border bg-[#d9d9d9]/12 text-pill-fg'
                )}
              >
                {/* Each glyph keeps its own artboard dimensions — not a uniform set. */}
                <Image
                  src={pill.icon}
                  alt=""
                  width={pill.w}
                  height={pill.h}
                  // Only the grey glyphs flip for dark; inverting the accent pair
                  // would turn #ed1a5e pink into teal.
                  className={cn('shrink-0', !pill.primary && 'dark:invert')}
                />
                {pill.label}
              </span>
            </span>
          </span>
        );
      })}
    </section>
  );
}
