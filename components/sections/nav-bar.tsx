'use client';

import { useSyncExternalStore } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { MobileMenuButton, useMobileMenu } from '@/components/mobile-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { nav } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * True once the page has scrolled past the nav's own inset.
 *
 * useSyncExternalStore rather than useState + useEffect for two reasons: it
 * reports the right value on the first client render, so reloading partway down
 * the page shows the bar immediately instead of flashing the transparent state;
 * and it avoids calling setState inside an effect, which the project's lint
 * config rejects (react-hooks/set-state-in-effect).
 */
/** The artboard's 16 gap above the nav, which `top-4` gives when it is fixed. */
const NAV_INSET = 16;

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

/**
 * Desktop (1512): logo 195x54, then a 426x58 pill holding the links plus the
 * night-mode switch, then a 270x58 outlined CTA. Mobile (402): hamburger,
 * centred logo, theme toggle.
 *
 * Rendered once in the root layout, not per page, so it is shared by every
 * route. It is `fixed` rather than `sticky` on purpose: the hero is sized to
 * 100svh, and a nav in normal flow would stack on top of that and push the page
 * past the viewport — the exact problem that hid the hero's lower half before.
 * Fixed also keeps it pinned while scrolling, and because the mobile drawer
 * transforms its shell, the nav still slides with the page when the drawer opens.
 */
export function NavBar() {
  const { open: drawerOpen, lockedY } = useMobileMenu();
  const scrolled = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 16,
    () => false // the server cannot know the scroll position
  );

  return (
    <header
      // While the drawer is out its shell is transformed, which makes the shell
      // the containing block for `fixed` children — a fixed nav would then be
      // pinned to the top of the document and scroll away off-screen, taking
      // the close button with it. Anchor to the captured offset instead.
      // + NAV_INSET because the inline top overrides `top-4`: pinning to the
      // bare offset dropped the 16 gap and the close button jumped up on open,
      // out of line with the drawer's logo. The artboard sits it at 21.62.
      style={drawerOpen ? { top: lockedY + NAV_INSET } : undefined}
      className={cn(
        'inset-x-0 z-50 transition-[top,padding,background-color,box-shadow] duration-300',
        drawerOpen ? 'absolute' : 'fixed',
        // The docked glass bar is suppressed while the drawer is out: the
        // artboard shows the plain nav there, and leaving it on painted a
        // translucent white strip across the top of the slid page.
        scrolled && !drawerOpen
          // Docked: a full-width glass bar. It has to sit flush at top-0 —
          // keeping the inset would leave a transparent strip above it with
          // page content sliding through.
          ? 'top-0 border-b border-nav-border bg-nav-scrim py-3 shadow-nav backdrop-blur-xl'
          : 'top-4 lg:top-6'
      )}
    >
      <div className="container-page flex items-center justify-between">
        {/* Mobile-only menu button; the desktop pill carries the links instead. */}
        <MobileMenuButton className="lg:hidden" />

        {/* 174x48 on the 402 artboard, the same 48 as desktop.
            Hidden while the drawer is out: the artboard's 402 board leaves a
            5px sliver of it past the slid page, but the shift is capped at 283
            so a wider phone shows a real chunk of the wordmark instead. */}
        <BrandLogo
          className={cn('h-[48px] transition-opacity duration-200', drawerOpen && 'opacity-0 lg:opacity-100')}
          priority
        />

        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-9 rounded-full border-[1.5px] border-nav-border bg-nav-bg py-1 pr-1 pl-[20px] shadow-nav lg:flex">
            {nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="tracked font-sans text-[16px] font-medium text-fg transition-opacity hover:opacity-70"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </nav>

          <a
            href={nav.cta.href}
            className="tracked hidden items-center justify-center rounded-full border-[1.5px] border-accent-2 bg-accent/5 px-[15px] py-[12px] font-sans text-[16px] font-medium text-accent-2 transition-colors hover:bg-accent/15 lg:inline-flex dark:bg-accent/[0.13]"
          >
            {nav.cta.label}
          </a>

          {/* Mobile keeps only the theme toggle — the rest lives in the drawer. */}
          <ThemeToggle
            className={cn(
              'size-[38px] border-[1.5px] border-black/[0.09] bg-surface shadow-[0_0_39.4px_rgb(0_0_0/0.08)] lg:hidden dark:border-white/[0.12]',
              drawerOpen && 'opacity-0'
            )}
          />
        </div>
      </div>
    </header>
  );
}
