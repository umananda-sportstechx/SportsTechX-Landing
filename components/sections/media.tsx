import { BlurImage } from '@/components/blur-image';
import type { CSSProperties } from 'react';
import { SectionIntro } from '@/components/section-intro';
import { media } from '@/lib/content';
import { latestIssues } from '@/lib/newsletter';
import { showArtwork } from '@/lib/podcast';
import vectors from '@/design/vectors.json';

/**
 * Four 634.29x338.93 cards on the cream band. Each is split: a 315-wide white
 * panel carrying the copy and a 319 image butted against it, with a 2px white
 * stroke at 20%. The design also rules the grid — a hairline down the middle
 * of each row and one across between them, drawn as rotated LINE nodes.
 *
 * The 402 artboard rearranges it: a 362x285 card whose image is the whole top
 * 191, with the kicker and headline laid over it in white, and only the action
 * label and category in a 94 white strip beneath. See the media rules in
 * globals.css — the same markup serves both.
 *
 * The card stays pale in dark mode (#dce3f4) and its copy goes black, so this
 * is --color-card-light rather than the page surface.
 *
 * The NEWSLETTER card carries the current issue, pulled from the same Beehiiv
 * feed the STX web app reads. The artboard's placeholder ("#191 IG Group's
 * $2.15B Bet on Underdog") is itself a real issue off that feed. If the feed is
 * unreachable the static copy stands in, so the card is never blank.
 */
/**
 * A tiny version of a remote image, to stand in while the full one loads.
 *
 * The optimiser validates both parameters: `q` is mandatory, and `w` has to be
 * one of the configured sizes — 16 is not among them in this version, which is
 * why an earlier `w=16&q=10` returned 400 and the live cards silently lost
 * their placeholder. 32 is the smallest allowed, and still about a kilobyte.
 * scratchpad/blurcheck.mjs fails if this ever 400s again.
 */
const tiny = (url: string) => `/_next/image?url=${encodeURIComponent(url)}&w=32&q=75`;

export async function Media() {
  // Both live sources in parallel — neither should hold the other up.
  const [issues, show] = await Promise.all([latestIssues(), showArtwork()]);
  const [latest] = issues;

  return (
    <section id="media" data-rise className="noise section-y bg-band-2 [--noise-alpha:0.2] dark:[--noise-alpha:0.45]">
      <div className="container-page">
        <SectionIntro title={media.title} subtitle={media.subtitle} />

        <div className="media-rig relative">
          {/* Grid rules: one down each row, one across between them. */}
          <span
            aria-hidden
            className="media-rule-v pointer-events-none absolute top-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#b6b6b6] lg:block"
          />
          <span
            aria-hidden
            className="media-rule-v media-rule-v-2 pointer-events-none absolute left-1/2 hidden w-px -translate-x-1/2 bg-[#b6b6b6] lg:block"
          />
          <span
            aria-hidden
            className="media-rule-h pointer-events-none absolute inset-x-0 hidden h-px bg-[#b6b6b6] lg:block"
          />

          <div className="media-grid mt-[42px] grid gap-6 lg:grid-cols-2">
            {media.items.map((item) => {
              const key = item.category.toLowerCase();
              const icon = vectors[`icon-media-${key}` as keyof typeof vectors];
              const live = item.category === 'NEWSLETTER' ? latest : undefined;
              const title = live?.title ?? item.title;
              const href = live?.link ?? item.href;
              const image =
                item.category === 'PODCAST' ? show?.image || item.image : live?.image || item.image;
              return (
                <article
                  key={item.category}
                  className="media-card group relative grid overflow-hidden rounded-[20px] bg-card-light shadow-card hover:shadow-panel"
                >
                  <div className="media-copy flex flex-col justify-between gap-6 p-[27px]">
                    {/* Below lg this block is lifted over the image and set in
                        white; from lg it sits in the copy panel in colour. */}
                    <div className="media-into flex flex-col gap-3">
                      {/* REPORTS and EVENTS hide their kicker and its rule. */}
                      {item.kicker && (
                        <>
                          <p className="media-kicker font-mono text-[14px] leading-[19px] text-white/90 uppercase lg:text-green lg:dark:text-[#1f7a5c]">
                            {item.kicker}
                          </p>
                          <span
                            aria-hidden
                            className="media-breaker block h-px w-full bg-white/70 lg:bg-[#6b6b6b]/35"
                          />
                        </>
                      )}
                      {/* Clamped: a live issue title can run far longer than
                          the artboard's two lines. */}
                      <p className="media-title line-clamp-2 font-sans text-[18px] leading-[1.43] font-medium whitespace-pre-line text-white lg:text-heading lg:dark:text-black">
                        {title}
                      </p>
                    </div>

                    <div className="media-cat flex flex-col gap-1">
                      <span className="media-label tracked inline-flex items-center gap-[9px] font-mono text-[12px] leading-[15px] text-[#878787] dark:text-black">
                        {/* eslint-disable-next-line @next/next/no-img-element -- a
                            flat artboard vector; next/image would only wrap it. */}
                        <img
                          src={`/vectors/icon-media-${key}.svg`}
                          alt=""
                          style={{ '--iw': icon.w, '--ih': icon.h } as CSSProperties}
                          className="size-[13px] shrink-0 object-contain dark:brightness-0"
                        />
                        {item.action}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="media-word tracked font-display text-[32px] leading-[1.28] text-accent uppercase">
                          {item.category}
                        </span>

                        {/* Straight redirects, not players. They sit above the
                            card's own stretched link so they stay clickable. */}
                        {item.links?.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${item.category} on ${link.label}`}
                            className="relative z-30 -m-1 grid place-items-center p-1 transition-opacity hover:opacity-75"
                          >
                            {/* The glyph is a mask tinted by `color`, so each
                                mark carries its own brand colour. */}
                            <span
                              aria-hidden
                              style={
                                {
                                  '--m': `url(/vectors/icon-${link.icon}.svg)`,
                                  color: link.color,
                                } as CSSProperties
                              }
                              className="brand-icon size-[26px]"
                            />
                          </a>
                        ))}
                      </span>
                    </div>
                  </div>

                  <div className="media-shot relative order-first overflow-hidden lg:order-none lg:min-h-[339px]">
                    <BlurImage
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 320px, 100vw"
                      // Blurred thumbnail first, then a cross-fade to the full
                      // image. The artboard photos are static imports and carry
                      // their own blur data; a live issue's hero arrives from
                      // the feed as a URL with none, so it points at a 16px
                      // optimisation of itself and the placeholder blurs it.
                      standIn={typeof image === 'string' ? tiny(image) : undefined}
                      className="object-cover"
                    />
                    {/* The artboard's stroke is INSIDE-aligned, so it belongs
                        over the photo. As a border on this box it inset the
                        image instead and read as a white frame against the
                        card. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/20 lg:border-2"
                    />
                  </div>

                  {/* The card's own destination, stretched across it — the card
                      can no longer be an <a> itself now that it contains one. */}
                  <a
                    href={href}
                    {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                    aria-label={`${item.category}: ${title}`}
                    className="absolute inset-0 z-20"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
