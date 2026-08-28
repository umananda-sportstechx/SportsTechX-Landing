import type { CSSProperties } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { footer } from '@/lib/content';
import vectors from '@/design/vectors.json';
import { cn } from '@/lib/utils';

/**
 * The artboard's footer: a logo column, three link columns, and the "Cloud
 * grid" of 2px rules that frames them — two horizontals running 4 units wider
 * than the content column on each side, and three verticals that overhang the
 * columns above and below.
 *
 * The 402 artboard rules it differently: the columns stack, so the grid there
 * is six horizontals — one above, one between each pair, one before the legal
 * rows. The inner three are the columns' own top borders; see globals.css.
 *
 * There is no newsletter block in the design; the site had one that was never
 * drawn. Glyphs are the artboard's own vectors, tinted through a CSS mask so
 * they follow the text colour in both themes.
 */
const ICON_VRULES = [496, 791, 1085];

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

        <div className="footer-details relative mt-12 grid gap-12 lg:grid-cols-4">
          {ICON_VRULES.map((x) => (
            <span
              key={x}
              aria-hidden
              style={{ '--x': x } as CSSProperties}
              className="footer-vrule hidden bg-line/50 lg:block dark:bg-line"
            />
          ))}

          <div className="footer-col-1 flex flex-col gap-[18px]">
            {/* The artboard ships one pink lockup for every placement; black
                here is a brand call from the client, so it is filtered rather
                than a second asset. */}
            <BrandLogo className="footer-logo h-[41px] self-start brightness-0 dark:invert" />

            <p className="footer-desc font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55">
              {footer.blurb}
            </p>

            <div className="flex flex-col gap-px">
              <a
                href={`mailto:${footer.email}`}
                className="footer-contact inline-flex items-center gap-[13px] font-sans text-body-sm text-heading transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
              >
                <Icon name="mail" />
                <span className="text-heading/70 dark:text-heading/55">{footer.email}</span>
              </a>
              <span className="footer-contact inline-flex items-center gap-[15px] font-sans text-body-sm text-heading">
                <Icon name="pin" />
                <span className="text-heading/70 dark:text-heading/55">{footer.location}</span>
              </span>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title} className="footer-col flex flex-col gap-[21px]">
              <h2 className="footer-head tracked font-display text-eyebrow leading-[1.45] text-black uppercase dark:text-white">
                {column.title}
              </h2>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="footer-link inline-flex items-center gap-[15px] font-sans text-body leading-[1.78] text-heading/70 dark:text-heading/55 transition-colors duration-[80ms] ease-out hover:text-black active:text-heading/50 dark:hover:text-white"
                    >
                      {'icon' in link && <Icon name={link.icon as string} />}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <span aria-hidden className="footer-rule footer-rule-bottom mt-12 block h-px w-full bg-line/50 dark:bg-line" />

        <div className="footer-legal mt-6 flex flex-col gap-2 pb-10 font-mono text-legal text-heading/70 lg:flex-row lg:items-center lg:justify-between dark:text-heading/55">
          <p>{footer.legal}</p>
          <p>
            {footer.legalLinks.map((link, i) => (
              <span key={link.label}>
                {i > 0 && <span aria-hidden> · </span>}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
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
