import { BlurImage } from '@/components/blur-image';
import { Fragment } from 'react';
import { Carousel } from '@/components/carousel';
import { trustedBy } from '@/lib/content';
import { SectionIntro } from '@/components/section-intro';

/**
 * Two rows of 210x278 partner cards on the cream band, each independently
 * scrollable, with a 264px hairline between every pair of cards. Those dividers
 * are rotated LINE nodes in the .fig, which is why they read as horizontal in
 * the extracted data — see `rotation` in scripts/fig-extract.mjs.
 *
 * Both rows crop to the same 1349px width. The artboard staggers the second one
 * by shifting its card group -141px *inside* that crop — not by widening the
 * row, which is what an earlier `-ml-[141px]` on the scroll container did, and
 * why the bottom row spilled past the page column. It is a starting scroll
 * position instead, so both rows stay identical in width.
 *
 * The rows drift continuously in opposite directions, with a 29px fade at each
 * edge in the band's own colour, as the artboard's "Left Mask" rects do.
 *
 * The 402 artboard is a different animal: 158x211 cards with a 175-tall photo,
 * a flat 12 gutter, and none of the desktop furniture — no dividers between the
 * cards, no fade at the edges and no arrows. All of that is desktop-only below.
 */
export function TrustedBy() {
  const rows = [trustedBy.partners, [...trustedBy.partners.slice(4), ...trustedBy.partners.slice(0, 4)]];

  return (
    <section data-rise className="noise section-y bg-band [--noise-alpha:0.3] dark:[--noise-alpha:0]">
      <div className="container-page">
        <SectionIntro title={trustedBy.title} subtitle={trustedBy.subtitle} />

        {/* Full-bleed on mobile: the artboard runs row 1 off the right edge
            and row 2 off the left, so the rows break out of the page gutter
            rather than sitting inside it. */}
        <div className="mt-[21px] mx-[calc(var(--gutter)*-1)] flex flex-col gap-[11px] lg:mx-0 lg:mt-[86px] lg:gap-[38px]">
          {rows.map((row, i) => (
            <Carousel
              key={i}
              label={`Trusted by, row ${i + 1}`}
              autoScroll={i === 0 ? 'ltr' : 'rtl'}
              initialOffset={i === 1 ? 141 : 0}
              // The artboard gives mobile no arrows at all.
              arrowClassName="hidden lg:grid"
              // The fade belongs on the TRACK, not the carousel root — the root
              // also holds the arrows, which sit at those very edges and were
              // being faded away with the cards. Desktop only: the 402 artboard
              // runs its rows to a hard edge.
              // py-1 is desktop-only: the artboard's partner groups carry no
              // padding, and 4 top and bottom turned the designed 11 between
              // the rows into 19 of visible space.
              trackClassName="gap-[12px] lg:gap-[37px] lg:py-1 lg:[--edge:29px] lg:[mask-image:linear-gradient(to_right,transparent_0,#000_var(--edge),#000_calc(100%-var(--edge)),transparent_100%)]"
            >
              {row.map((partner, j) => (
                <Fragment key={`${i}-${j}`}>
                  {/* Before every card, not just between them: the track loops,
                      so skipping the first left the join between the last card
                      and the first with no rule while every other pair had one. */}
                  <span aria-hidden className="my-auto hidden h-[264px] w-px shrink-0 self-center bg-[#b6b6b6] lg:block" />
                  <article className="w-[158px] shrink-0 snap-start sm:w-[171px] xl:w-[210px]">
                    <div className="relative h-[175px] overflow-hidden rounded-[7px] sm:h-[191px] xl:h-[232px]">
                      <BlurImage
                        src={partner.photo}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 210px, (min-width: 640px) 171px, 158px"
                        className="object-cover"
                      />
                      {/* Bottom scrim: #454545 transparent to #232529 opaque. */}
                      <div className="absolute inset-x-0 bottom-0 h-[55px] bg-linear-to-b from-[#454545]/0 to-[#232529] lg:h-[72px]" />
                      <span className="absolute inset-x-0 bottom-[11px] text-center font-sans text-[14px] leading-none font-bold tracking-[-0.02em] text-white lg:bottom-[15px] lg:text-[19px]">
                        {partner.logo}
                      </span>
                    </div>
                    <div className="mt-[6px] text-center">
                      <p className="font-sans text-[11px] leading-[16px] font-medium text-fg">{partner.name}</p>
                      <p className="font-mono text-[9px] leading-[14px] text-fg-muted">{partner.role}</p>
                    </div>
                  </article>
                </Fragment>
              ))}
            </Carousel>
          ))}
        </div>
      </div>
    </section>
  );
}
