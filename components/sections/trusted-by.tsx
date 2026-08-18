import Image from 'next/image';
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
 * The design offsets the second row by -141px so it starts mid-card, which is
 * what gives the grid its staggered look.
 */
export function TrustedBy() {
  const rows = [trustedBy.partners, [...trustedBy.partners.slice(4), ...trustedBy.partners.slice(0, 4)]];

  return (
    <section className="section-y bg-band">
      <div className="container-page">
        <SectionIntro title={trustedBy.title} subtitle={trustedBy.subtitle} />

        <div className="mt-[50px] flex flex-col gap-[38px] lg:mt-[86px]">
          {rows.map((row, i) => (
            <Carousel
              key={i}
              label={`Trusted by, row ${i + 1}`}
              trackClassName={`gap-[37px] py-1 ${i === 1 ? '-ml-[141px]' : ''}`}
            >
              {row.map((partner, j) => (
                <Fragment key={`${i}-${j}`}>
                  {j > 0 && (
                    <span aria-hidden className="my-auto h-[264px] w-px shrink-0 self-center bg-[#b6b6b6]" />
                  )}
                  <article className="w-[210px] shrink-0 snap-start">
                    <div className="relative h-[232px] overflow-hidden rounded-[7px]">
                      <Image src={partner.photo} alt="" fill sizes="210px" className="object-cover" />
                      {/* Bottom scrim: #454545 transparent to #232529 opaque. */}
                      <div className="absolute inset-x-0 bottom-0 h-[72px] bg-linear-to-b from-[#454545]/0 to-[#232529]" />
                      <span className="absolute inset-x-0 bottom-[15px] text-center font-sans text-[19px] leading-none font-bold tracking-[-0.02em] text-white">
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
