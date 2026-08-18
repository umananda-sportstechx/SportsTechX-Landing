import Image from 'next/image';
import { Carousel } from '@/components/carousel';
import { trustedBy } from '@/lib/content';
import { SectionIntro } from '@/components/section-intro';

/**
 * Two rows of 210x278 partner cards on the cream band, each independently
 * scrollable. The second row is offset by starting from a rotated copy of the
 * list, matching the staggered look of the artboard.
 */
export function TrustedBy() {
  const rows = [trustedBy.partners, [...trustedBy.partners.slice(4), ...trustedBy.partners.slice(0, 4)]];

  return (
    <section className="bg-band py-[86px] lg:py-[110px]">
      <div className="container-page">
        <SectionIntro title={trustedBy.title} subtitle={trustedBy.subtitle} />

        <div className="mt-[50px] flex flex-col gap-[38px] lg:mt-[86px]">
          {rows.map((row, i) => (
            <Carousel key={i} label={`Trusted by, row ${i + 1}`} trackClassName="gap-[37px] py-1">
              {row.map((partner, j) => (
                <article key={`${i}-${j}`} className="w-[210px] shrink-0 snap-start">
                  <div className="relative h-[232px] overflow-hidden rounded-[7px]">
                    <Image
                      src={partner.photo}
                      alt=""
                      fill
                      sizes="210px"
                      className="object-cover"
                    />
                    {/* Bottom scrim from the design: #454545 to #232529. */}
                    <div className="absolute inset-x-0 bottom-0 h-[72px] bg-linear-to-b from-[#454545]/0 to-[#232529]/90" />
                  </div>
                  <div className="mt-[6px] text-center">
                    <p className="font-sans text-[11px] leading-[16px] font-medium text-fg">{partner.name}</p>
                    <p className="font-sans text-[9px] leading-[14px] text-fg-muted">{partner.role}</p>
                  </div>
                </article>
              ))}
            </Carousel>
          ))}
        </div>
      </div>
    </section>
  );
}
