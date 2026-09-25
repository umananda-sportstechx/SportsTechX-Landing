import type { CSSProperties } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { footer } from '@/lib/content';
import vectors from '@/design/vectors.json';
import { cn } from '@/lib/utils';

/**
 * A logo column, four link columns, and the "Cloud grid" of 2px rules that
 * frames them — two horizontals running 4 units wider than the content column
 * on each side, and a vertical before each link column that overhangs above and
 * below.
 *
 * The artboard drew three link columns and placed its verticals at a hardcoded
 * x=496/791/1085. Those were measurements, not arithmetic: the track boundaries
 * sat at 545/848/1151, so each rule was a different distance (49, 57, 66) to the
 * left of its boundary and a column change meant re-measuring all of them. Each
 * link column now draws its own rule instead, so the count follows the content.
 *
 * The 402 artboard rules it differently: the columns stack, so the grid there is
 * one horizontal above, one per column, and one before the legal rows. The inner
 * ones are the columns' own top borders; see globals.css.
 *
 * Glyphs are the artboard's own vectors, tinted through a CSS mask so they
 * follow the text colour in both themes.
 */
function Icon({ name, className }: { name: string; className?: string }) {
  const art = vectors[`icon-footer-${name}` as keyof typeof vectors];
  return (
    <span
      aria-hidden
      style={
        {
          '--iw': art.w,
          '--ih': art.h,
          '--m': `url(/vectors/icon-footer-${name}.svg)`,
        } as CSSProperties
      }
      className={cn('footer-icon size-4', className)}
    />
  );
}

export function Footer() {
  return (
    <footer id="about" data-rise className="relative bg-surface">
      {/* The container query box must be the content column, not the footer:
          container-type on the <footer> made 100cqw the viewport and scaled
          every artboard unit by 1.1. */}
      <div className="footer-rig container-page">
        <span aria-hidden className="footer-rule footer-rule-top mt-12 block h-px w-full bg-line/50 dark:bg-line" />

        <div className="footer-details relative mt-12 grid gap-12 lg:grid-cols-5">
          <div className="footer-col-1 flex flex-col gap-[18px]">
            {/* The artboard ships one pink lockup for every placement; black
                here is a brand call from the client, so it is filtered rather
                than a second asset. */}
            <BrandLogo className="footer-logo h-[41px] self-start brightness-0 dark:invert" />

            <p className="footer-desc font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55">
              {footer.blurb}
            </p>

            {/* A GET form, not a POST: the newsletter is Beehiiv and nothing in
                this monorepo holds a Beehiiv key or publication id — the legacy
                app only ever read the RSS feed and linked out to subscribe.
                This carries the address over as ?email= so the visitor lands on
                the hosted form with it filled in, and needs no JavaScript, no
                route and no secret.

                The pill takes the nav CTA's border and the submit takes the
                hero button's accent, hover-to-black and press behaviour, so it
                reads as the same family of control rather than a new one. */}
            <form
              action={footer.newsletterAction}
              method="get"
              target="_blank"
              rel="noreferrer"
              className="footer-join flex w-full items-center rounded-full border-[1.5px] border-nav-border bg-nav-bg p-[5px] shadow-nav"
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="footer-join-input min-w-0 flex-1 bg-transparent px-[18px] font-sans text-body-sm text-heading outline-none placeholder:text-fg-muted"
              />
              <button
                type="submit"
                className={cn(
                  'footer-join-btn group tracked shrink-0 rounded-full bg-accent-2 px-[26px] font-mono text-cta text-white shadow-cta',
                  'hover:bg-black active:bg-black',
                  'transition-[background-color,scale] duration-200 ease-out active:duration-[80ms]',
                  'motion-safe:hover:scale-105 motion-safe:active:scale-95'
                )}
              >
                <span className="transition-opacity duration-[80ms] ease-out group-active:opacity-70">
                  JOIN
                </span>
              </button>
            </form>
          </div>

          {footer.columns.map((column) => {
            const labelled = column.links.filter((l) => !l.iconOnly);
            const glyphs = column.links.filter((l) => l.iconOnly);
            return (
              <div key={column.title} className="footer-col relative flex flex-col gap-[21px]">
                <h2 className="footer-head tracked font-display text-eyebrow leading-[1.45] text-black uppercase dark:text-white">
                  {column.title}
                </h2>
                <ul className="flex flex-col">
                  {labelled.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                        className="footer-link inline-flex items-center gap-[15px] font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55 transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
                      >
                        {link.icon && <Icon name={link.icon} />}
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                {/* Socials sit as bare glyphs on one row. The label is dropped
                    from view but carried as the accessible name — without it
                    the link would announce as nothing. */}
                {glyphs.length > 0 && (
                  <ul className="flex items-center gap-4">
                    {glyphs.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={link.label}
                          className="footer-link inline-flex text-heading/70 dark:text-heading/55 transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
                        >
                          {link.icon && <Icon name={link.icon} />}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <span aria-hidden className="footer-rule footer-rule-bottom mt-12 block h-px w-full bg-line/50 dark:bg-line" />

        <div className="footer-legal mt-6 flex flex-col gap-2 pb-10 font-mono text-legal text-heading/70 lg:flex-row lg:items-center lg:justify-between dark:text-heading/55">
          <p>{footer.legal}</p>
          <p>
            {footer.legalLinks.map((link, i) => (
              <span key={link.label}>
                {i > 0 && <span aria-hidden> · </span>}
                {/* Same-origin now that these pages are ours; only a genuinely
                    external link should steal a tab. Mirrors the column links. */}
                <a
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
