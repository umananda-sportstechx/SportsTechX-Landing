import { BrandLogo } from '@/components/brand-logo';
import { MobileMenuButton } from '@/components/mobile-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { nav } from '@/lib/content';

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
  return (
    <header className="fixed inset-x-0 top-4 z-50 lg:top-6">
      <div className="container-page flex items-center justify-between">
      {/* Mobile-only menu button; the desktop pill carries the links instead. */}
      <MobileMenuButton className="lg:hidden" />

      <BrandLogo className="h-[38px] lg:h-[54px]" priority />

      <div className="flex items-center gap-5">
        <nav className="hidden items-center gap-9 rounded-full border-[1.5px] border-nav-border bg-nav-bg py-2 pr-2.5 pl-[35px] shadow-nav lg:flex">
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
          className="tracked hidden items-center justify-center rounded-full border-[1.5px] border-accent-2 bg-accent/5 px-[15px] py-[18px] font-sans text-[16px] font-medium text-accent-2 transition-colors hover:bg-accent/15 lg:inline-flex dark:bg-accent/[0.13]"
        >
          {nav.cta.label}
        </a>

        {/* Mobile keeps only the theme toggle — the rest lives in the drawer. */}
          <ThemeToggle className="size-[38px] border-[1.5px] border-nav-border bg-surface lg:hidden" />
        </div>
      </div>
    </header>
  );
}
