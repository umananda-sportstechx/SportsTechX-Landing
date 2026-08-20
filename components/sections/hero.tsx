import Image from 'next/image';
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
 *
 * The radii fall into three pairs, each pair sharing an orbit. The two capsules
 * on an orbit run at the same speed in OPPOSITE directions, so they meet and
 * pass twice a revolution. Duration is per orbit — outermost slowest, innermost
 * fastest, as orbits actually behave. No delays: the first painted frame is the
 * artboard.
 */
/*
 * `sweep` is how far a pill travels from its artboard angle and back. Only the
 * UPPER half of each circle is on screen — the motif centre sits at ~94% of the
 * hero's height — so a full revolution parked every pill off-screen for half its
 * cycle. Each sweep therefore points INWARD, toward the top of the arc: the two
 * on the right go negative, the three on the left positive.
 *
 * Inward rather than a centred swing, because the outermost pills have almost no
 * room the other way: MEDIA sits 6.6deg from -180 and INVESTORS 9.3deg from 0, so
 * a symmetric oscillation would have to be tiny for them. It also keeps each
 * orbit's pair counter-rotating for free, since partners sit on opposite sides.
 */
const ORBIT = { outer: 26, mid: 22, inner: 18 };
const SWEEP = 35;

type Pill = { r: number; a: number; mr?: number; ma?: number; dur: number; sweep: number };

const PILLS: Record<string, Pill> = {
  // 57.3% orbit
  LEAGUES: { r: 57.1, a: -25.4, mr: 40.9, ma: -45.0, dur: ORBIT.outer, sweep: -SWEEP },
  MEDIA: { r: 57.5, a: -173.4, dur: ORBIT.outer, sweep: SWEEP },
  // 52.75% orbit
  ATHLETES: { r: 52.8, a: -10.8, dur: ORBIT.mid, sweep: -SWEEP },
  TEAMS: { r: 52.7, a: -157.0, mr: 45.5, ma: -135.8, dur: ORBIT.mid, sweep: SWEEP },
  // 16.85% orbit
  INVESTORS: { r: 16.7, a: -9.3, mr: 26.4, ma: 4.6, dur: ORBIT.inner, sweep: -SWEEP },
  FOUNDERS: { r: 17.0, a: -146.4, mr: 24.0, ma: -157.2, dur: ORBIT.inner, sweep: SWEEP },
};

export function Hero() {
  return (
    <section className="hero-frame relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-hero">
      {/* Epicentre motif, exported from Figma as a single SVG. Sized off the
          frame's height so the orbits keep their proportions at any viewport. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[var(--motif-cy)] left-1/2 -z-30 aspect-square h-[calc(var(--motif-r)*2)] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/icons/epicentre-motif.svg"
          alt=""
          fill
          priority
          className="object-contain dark:opacity-40 dark:invert dark:hue-rotate-180"
        />
      </div>

      <div // 22.3% is the artboard's own content offset (224 of the 1004 hero); 18%
        // sat the whole block — headline, subhead and buttons — about four
        // points high. Mobile's 13% already matches its own board (115.8/852).
        className="absolute inset-x-0 top-[13%] flex flex-col items-center px-5 text-center lg:top-[22.3%] lg:px-0">
        {/* Mutes the orbits where they pass behind the copy. */}
        <div aria-hidden className="hero-scrim" />

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
                '--sweep': `${p.sweep}deg`,
              } as React.CSSProperties
            }
            // -z-10 puts the pills behind the headline and CTAs, so a full
            // revolution tucks them under the text instead of covering it. They
            // still sit above the motif, which is earlier in the DOM.
            className={cn('orbit -z-20', !p.mr && 'hidden lg:block')}
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
