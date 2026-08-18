import { stats } from '@/lib/content';

/**
 * The navy band — 1513x308, four figures at Bebas 72/68 with 1px white
 * dividers between and on both ends.
 */
export function Stats() {
  return (
    <section className="section-y bg-stats">
      <div className="container-page">
        {/* Four equal columns with a rule between and on both outer edges,
            matching the five "Breaker" lines on the artboard. */}
        <ul className="grid grid-cols-2 gap-y-10 lg:flex lg:justify-center lg:border-r lg:border-white/60">
          {stats.map((stat) => (
            <li
              key={stat.value}
              className="flex flex-col gap-[9px] px-6 text-white lg:w-[272px] lg:border-l lg:border-white/60 lg:px-0 lg:pl-[50px]"
            >
              <p className="font-display text-stat leading-[0.94]">{stat.value}</p>
              <p className="tracked font-sans text-body-sm whitespace-pre-line">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
