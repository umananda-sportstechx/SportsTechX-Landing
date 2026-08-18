import Image from 'next/image';
import { NavBar } from '@/components/sections/nav-bar';
import { hero } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Pill placement as a share of the "Pills" frame it lives in — 984x204 on
 * desktop, 350x169 on mobile. The design drops MEDIA and ATHLETES on mobile,
 * so those two carry no mobile coordinates and are hidden below lg.
 */
const PILLS: Record<string, { d: [number, number]; m?: [number, number] }> = {
  LEAGUES: { d: [87.0, 0], m: [73.7, 7.1] },
  TEAMS: { d: [7.4, 15.2], m: [0, 0] },
  MEDIA: { d: [0, 69.6] },
  ATHLETES: { d: [87.0, 56.9] },
  FOUNDERS: { d: [33.7, 58.8], m: [8.0, 56.8] },
  INVESTORS: { d: [58.2, 84.8], m: [66.9, 85.8] },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero pb-12 lg:pb-16">
      {/* The artboard's "Noise Textiure" and "Gradient Overlay" layers are both
          visible:false in the .fig — the hero is the flat --hero colour. */}

      {/* Epicentre motif, exported from Figma as a single SVG rather than
          rebuilt from six CSS circles — the concentric orbits and their green
          wash only read correctly as the original artwork. On the artboard it is
          1586px square in a 1512x1004 hero, centred horizontally with its centre
          57px above the hero's bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[57px] left-1/2 -z-10 aspect-square w-[230%] -translate-x-1/2 translate-y-1/2 sm:w-[150%] lg:w-[104.9%]"
      >
        <Image
          src="/icons/epicentre-motif.svg"
          alt=""
          fill
          priority
          className="object-contain dark:opacity-40 dark:invert dark:hue-rotate-180"
        />
      </div>

      <NavBar />

      <div className="container-page relative mt-[48px] flex flex-col items-center text-center lg:mt-[58px]">
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

      {/* Category pills scattered over the motif, positioned exactly as designed. */}
      <div className="relative mx-auto mt-10 h-[122px] w-[350px] lg:mt-14 lg:h-[147px] lg:w-[984px]">
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
                } as React.CSSProperties
              }
              className={cn(
                'absolute top-[var(--my)] left-[var(--mx)] lg:top-[var(--dy)] lg:left-[var(--dx)]',
                'inline-flex h-[24px] items-center gap-[7px] rounded-full px-[14px] font-mono text-micro',
                'shadow-pill tracking-[0.1em] lg:h-[31px] lg:px-[22px]',
                pill.primary
                  ? 'border-2 border-accent bg-white text-accent-2 dark:bg-surface'
                  : 'border-2 border-pill-border bg-[#d9d9d9]/12 text-pill-fg',
                !pos.m && 'hidden lg:inline-flex'
              )}
            >
              {/* Each glyph keeps its own artboard dimensions — they are not a
                  uniform set, so no shared icon size. */}
              <Image src={pill.icon} alt="" width={pill.w} height={pill.h} className="shrink-0 dark:invert" />
              {pill.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
