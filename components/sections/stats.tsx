import { Fragment } from 'react';
import { stats } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * The navy band. On the artboard the section is 1513x308 and the row inside it
 * is 1086x149 laid out as
 *   rule, stat, rule, stat, rule, stat, rule, stat, rule
 * — five zero-width rules with a 50px gap either side, so they land evenly at
 * x = 0, 272, 543, 814, 1086.
 *
 * That structure is reproduced literally here. The previous version put the
 * outer rules on the list's own left/right borders, and because the list
 * stretched to the container the final rule landed at the container edge
 * instead of 50px past the last figure — which is why the last gap was double
 * the others. `w-fit` is what holds the row to its content.
 *
 * Everything is 0.9x the artboard: figure 72 -> 64.8, caption 16 -> 14.4 (both
 * off --scale-stat so the designed 4.5:1 survives), rules 149 -> 134, gap 50 -> 45.
 */
/* Rule height and column gap sit a little above the 0.9x type scale by choice —
 * the band reads better with more air than a strict 0.9 of the artboard's
 * 149/50 gives. The gap is fluid rather than fixed: the row is w-fit, so a flat
 * 56px would make it 1068px wide and overflow the container at the lg
 * breakpoint (1024px, where the column is only ~921px). This tracks from 28px
 * there up to 56px at 1512. */
const RULE = 'hidden w-px shrink-0 bg-white/20 lg:block lg:h-[158px]';

/**
 * The mobile cross. The artboard draws it as four separate 1px segments at 61%
 * white, not as cell borders: the vertical runs y 40-149 and 177-286 at x=201,
 * the horizontal x 40-187 and 215-364 at y=163. Both leave a 28 gap centred on
 * the intersection, so the two rules never actually touch. Written as shares of
 * the 362x274 grid so they hold at any phone width.
 */
const CROSS = [
  'top-[3.6%] left-1/2 h-[39.8%] w-px -translate-x-1/2',
  'top-[53.6%] left-1/2 h-[39.8%] w-px -translate-x-1/2',
  'top-[48.5%] left-[5.5%] h-px w-[40.6%]',
  'top-[48.5%] left-[53.9%] h-px w-[41.2%]',
];
const GAP = 'lg:gap-[clamp(28px,5.74vw-30.8px,56px)]';

export function Stats() {
  return (
    <section className="noise section-y bg-stats [--noise-alpha:0.6]">
      <div className="container-page">
        <div className="relative">
          {CROSS.map((pos) => (
            <span key={pos} aria-hidden className={cn('absolute bg-white/[0.61] lg:hidden', pos)} />
          ))}

        <ul
          className={cn(
            'grid grid-cols-2 text-white',
            // Top-aligned: each figure starts level with the top of its rule.
            // The artboard uses align: MAX, but there the rule is 149 against a
            // 140 block, so bottom-aligning offset the text by only 9px. Here
            // the rules are 158 against a ~106 block, which stranded ~52px of
            // empty space above every figure.
            'lg:mx-auto lg:flex lg:w-fit lg:items-start',
            GAP
          )}
        >
          {stats.map((stat, i) => (
            <Fragment key={stat.value}>
              <li aria-hidden className={RULE} />
              <li
                className={cn(
                  'flex flex-col gap-[8px] py-5 lg:w-[155px] lg:px-0 lg:py-0',
                  // Each column hugs its outer edge, 20 in, so the pair sits
                  // symmetrically either side of the centre rule.
                  i % 2 === 0
                    ? 'pl-5 text-left lg:pl-0 lg:text-left'
                    : 'pr-5 text-right lg:pr-0 lg:text-left'
                )}
              >
                <p className="font-display text-stat leading-[0.94]">{stat.value}</p>
                <p className="tracked font-sans text-stat-label leading-[1.3] whitespace-pre-line">
                  {stat.label}
                </p>
              </li>
              {i === stats.length - 1 && <li aria-hidden className={RULE} />}
            </Fragment>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
