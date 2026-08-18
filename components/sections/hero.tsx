import { Activity, Radio, Rocket, TrendingUp, Trophy, Users } from 'lucide-react';
import { NavBar } from '@/components/sections/nav-bar';
import { hero } from '@/lib/content';
import { cn } from '@/lib/utils';

const ICONS = {
  trophy: Trophy,
  users: Users,
  radio: Radio,
  activity: Activity,
  rocket: Rocket,
  trending: TrendingUp,
} as const;

/**
 * Six concentric rings — 1586, 1164, 882, 652, 454, 270 on the 1512 artboard,
 * kept as a share of the largest so the motif scales as one piece. The 882 ring
 * is the one the design dims (fill opacity 0.32 against the others' 0.59).
 */
const RINGS = [1586, 1164, 882, 652, 454, 270].map((d) => ({
  scale: d / 1586,
  dim: d === 882,
}));

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
      {/* The artboard's "Noise Textiure" (cream wash + grain) and "Gradient
          Overlay" layers are both visible:false in the .fig — the designer
          switched them off. The hero is the flat --hero colour plus the motif. */}

      {/* Epicentre motif. On the artboard the 1586px circle is centred at
          (757, 947) in a 1512x1004 hero — horizontally centred, and 57px above
          the hero's bottom edge. Anchoring from the bottom keeps that
          relationship whatever the content height turns out to be. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[57px] left-1/2 -z-10 aspect-square w-[230%] -translate-x-1/2 translate-y-1/2 sm:w-[150%] lg:w-[105%]"
      >
        {RINGS.map(({ scale, dim }, i) => (
          <span
            key={i}
            style={{
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
              // Figma stacks six near-white discs, each with an offset green
              // blob, and lets them composite. Replicating that literally in CSS
              // gives six tiny dots — the arcs in the artboard come from the
              // discs overlapping. Approximated instead as one offset green
              // wash per ring, tuned to match the rendered artboard.
              backgroundImage:
                'radial-gradient(circle at 56% 60%, var(--ring-from), transparent 55%)',
              opacity: dim ? 'calc(var(--ring-fill-opacity) * 0.09)' : 'calc(var(--ring-fill-opacity) * 0.16)',
              borderColor: 'var(--ring-stroke)',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px]"
          />
        ))}
        {/* The pink S, cropped out of the design's own logo asset so it keeps
            the exact brand shape and its transparency. */}
        <span className="absolute top-1/2 left-1/2 h-[80px] w-[57px] -translate-x-1/2 -translate-y-1/2 bg-[url('/images/dfb510ecda05.png')] bg-[length:291px_80px] bg-left bg-no-repeat" />
      </div>

      <NavBar />

      <div className="container-page relative mt-[48px] flex flex-col items-center text-center lg:mt-[58px]">
        <h1
          // max-width in em, not px, so the designed two-line break ("…ACCESS TO /
          // SPORTS TECH & VENTURE") survives the fluid type scale at every width.
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
                'tracked inline-flex h-[41px] w-[215px] items-center justify-center rounded-full font-mono text-cta text-white transition-opacity hover:opacity-90 lg:h-[54px] lg:w-[249px]',
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
          const Icon = ICONS[pill.icon as keyof typeof ICONS];
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
                'inline-flex h-[24px] items-center gap-[7px] rounded-full px-[14px] font-mono text-micro tracking-[0.1em] lg:h-[31px] lg:px-[22px]',
                pill.primary
                  ? 'border-2 border-accent bg-surface text-accent-2'
                  : 'border-2 border-pill-border bg-pill-bg text-pill-fg',
                !pos.m && 'hidden lg:inline-flex'
              )}
            >
              <Icon className="size-[12px] lg:size-[14px]" strokeWidth={1.25} />
              {pill.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
