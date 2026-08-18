import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SectionIntro } from '@/components/section-intro';
import { media } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Four 634x339 cards in a 2x2 grid on the cream band. Each is split: a white
 * panel carrying the copy and a square image butted against it.
 */
export function Media() {
  return (
    <section id="media" className="section-y bg-band-2">
      <div className="container-page">
        <SectionIntro title={media.title} subtitle={media.subtitle} />

        <div className="mt-[42px] grid gap-6 lg:mt-[62px] lg:grid-cols-2 lg:gap-[82px_82px]">
          {media.items.map((item) => (
            <a
              key={item.category}
              href={item.href}
              className="group grid overflow-hidden rounded-[6px] bg-surface transition-shadow hover:shadow-lg sm:grid-cols-2"
            >
              <div className="flex flex-col justify-between gap-6 p-[27px]">
                <div className="flex flex-col gap-3">
                  {/* REPORTS and EVENTS hide their kicker and its rule in the design. */}
                  {item.kicker && (
                    <>
                      <p
                        className={cn(
                          'text-[14px] leading-[19px] uppercase',
                          item.kickerFont === 'mono' ? 'font-mono text-green' : 'font-mono-alt text-mint'
                        )}
                      >
                        {item.kicker}
                      </p>
                      <span aria-hidden className="block h-px w-full bg-[#6b6b6b]/40" />
                    </>
                  )}
                  <p className="font-sans text-card-title leading-[1.43] font-medium whitespace-pre-line text-heading">
                    {item.title}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="tracked inline-flex items-center gap-[9px] font-mono text-[12px] leading-[15px] text-[#878787]">
                    <ArrowUpRight className="size-[13px]" strokeWidth={1.5} />
                    {item.action}
                  </span>
                  <span className="tracked font-display text-label-lg leading-[1.28] text-accent uppercase">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="relative order-first aspect-4/3 sm:order-none sm:aspect-auto sm:min-h-[339px]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
