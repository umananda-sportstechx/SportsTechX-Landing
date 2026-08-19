import Image from 'next/image';
import { NavBar } from '@/components/sections/nav-bar';
import { hero } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * On the artboard the hero is a fixed frame — 1512x1004 on desktop, 402x852 on
 * mobile — and every child is positioned as a share of it. Building it as
 * ordinary document flow was the mistake: the motif is sized off the frame, so
 * when the frame was too short the orbits rode up through the headline and the
 * stats band pulled into view. Keeping the frame's ratio keeps all of that
 * geometry correct at any width.
 *
 * Percentages below are the artboard offsets divided by the frame:
 *   motif   (-36, 154) 1586 wide  ->  -2.38%, 15.3%, 104.9%
 *   content (188, 224) 1128 wide  ->  12.4%, 22.3%, 74.6%
 */
const PILLS: Record<string, { d: [number, number]; m?: [number, number]; spin: number; delay: number }> = {
  LEAGUES: { d: [73.0, 73.4], m: [69.7, 78.0], spin: 13, delay: 0 },
  TEAMS: { d: [21.2, 76.5], m: [5.5, 76.6], spin: 16, delay: -3 },
  MEDIA: { d: [16.4, 87.5], spin: 15, delay: -6 },
  ATHLETES: { d: [73.0, 84.9], spin: 18, delay: -2 },
  FOUNDERS: { d: [38.4, 85.4], m: [12.4, 87.9], spin: 14, delay: -8 },
  INVESTORS: { d: [54.3, 90.6], m: [63.7, 93.7], spin: 17, delay: -5 },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero">
      {/* The frame. aspect-ratio holds the artboard's proportions; the max-height
          stops a wide monitor from turning the hero into a full-screen band, and
          the min-height keeps the fluid type from ever overflowing it. */}
      <div className="relative mx-auto min-h-[640px] w-full [aspect-ratio:402/852] lg:max-h-[1004px] lg:min-h-[720px] lg:[aspect-ratio:1512/1004]">
        {/* Epicentre motif, exported from Figma as a single SVG — the orbits and
            their green wash only read correctly as the original artwork. */}
        <div
          aria-hidden
          // Sized off the frame's HEIGHT, not its width: once max-height clamps
          // the frame on a wide monitor the aspect ratio no longer holds, and a
          // width-based motif overflows and drops the S out of view. Against the
          // artboard the circle is 158% of the hero's height (1586/1004) starting
          // at 15.3% down, horizontally centred — 402x852 mobile is 100.7%/45.1%.
          className="pointer-events-none absolute top-[45.1%] left-1/2 -z-10 aspect-square h-[100.7%] -translate-x-1/2 lg:top-[15.3%] lg:h-[158%]"
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
        <div className="absolute inset-x-0 top-4 lg:top-[8.5%]">
          <NavBar />
        </div>

        <div className="absolute top-[13%] right-0 left-0 flex flex-col items-center px-5 text-center lg:top-[22.3%] lg:right-[12.4%] lg:left-[12.4%] lg:px-0">
          <h1
            // max-width in em, not px, so the designed two-line break survives
            // the fluid type scale at every width.
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

        {/* Category pills, sitting on the orbits. Each drifts around the motif
            centre on its own cycle; the label counter-rotates to stay upright. */}
        {hero.pills.map((pill) => {
          const pos = PILLS[pill.label];
          return (
            <span
              key={pill.label}
              style={
                {
                  '--mx': `${pos.m?.[0] ?? pos.d[0]}%`,
                  '--my': `${pos.m?.[1] ?? pos.d[1]}%`,
                  '--dx': `${pos.d[0]}%`,
                  '--dy': `${pos.d[1]}%`,
                  '--spin': `${pos.spin}s`,
                  '--spin-delay': `${pos.delay}s`,
                } as React.CSSProperties
              }
              className={cn(
                'orbit absolute top-[var(--my)] left-[var(--mx)] lg:top-[var(--dy)] lg:left-[var(--dx)]',
                !pos.m && 'hidden lg:block'
              )}
            >
              <span
                className={cn(
                  'orbit-body inline-flex h-[24px] items-center gap-[7px] rounded-full px-[14px] font-mono text-micro',
                  'shadow-pill tracking-[0.1em] lg:h-[31px] lg:px-[22px]',
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
                  // Only the grey glyphs flip for dark. Inverting the accent
                  // pair would turn #ed1a5e pink into teal.
                  className={cn('shrink-0', !pill.primary && 'dark:invert')}
                />
                {pill.label}
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
