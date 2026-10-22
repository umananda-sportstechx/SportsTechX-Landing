'use client';

/**
 * An anchor that also flips the Solutions sector toggle on click (the Solutions
 * section listens for `stx:sector`). The href still scrolls `#solutions` into
 * view. Used by the footer's Solutions links; the nav dropdown inlines the same
 * dispatch.
 */
export function SectorLink({
  href,
  sector,
  className,
  children,
}: {
  href: string;
  sector: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => window.dispatchEvent(new CustomEvent('stx:sector', { detail: sector }))}
      className={className}
    >
      {children}
    </a>
  );
}
