'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { mobileMenu } from '@/lib/content';
import { cn } from '@/lib/utils';

type MenuState = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /**
   * Scroll offset captured when the drawer opened. The shell is translated
   * while the drawer is out, and a transformed ancestor becomes the containing
   * block for `fixed` descendants — so the fixed nav inside it stops resolving
   * against the viewport and lands at the top of the *document*. Anchoring it
   * to this offset instead keeps it at the visible top while it slides with the
   * page, which is what the artboard shows.
   */
  lockedY: number;
};
const MobileMenuContext = createContext<MenuState | null>(null);

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) throw new Error('useMobileMenu must be used inside <MobileMenuProvider>');
  return ctx;
}

/**
 * The design's menu is a drawer: the cream panel sits underneath and the whole
 * page slides right, exposing a rounded, bordered edge (radius 41, 2px border).
 * The provider owns the state so the nav button and the page shell can share it.
 */
export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lockedY, setLockedY] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  // Captured in the handler, not an effect, so it is read before the body
  // scroll lock takes hold.
  const toggle = useCallback(() => {
    setLockedY(window.scrollY);
    setOpen((v) => !v);
  }, []);

  // Escape closes; body scroll is locked while the drawer is out.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const value = useMemo(() => ({ open, toggle, close, lockedY }), [open, toggle, close, lockedY]);
  return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
}

/** The hamburger / close button that lives in the mobile nav bar. */
export function MobileMenuButton({ className }: { className?: string }) {
  const { open, toggle } = useMobileMenu();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn(
        'grid size-[38px] place-items-center rounded-full border-[1.5px] border-fg bg-surface text-fg',
        className
      )}
    >
      {open ? <X className="size-[18px]" strokeWidth={1.5} /> : <Menu className="size-[18px]" strokeWidth={1.5} />}
    </button>
  );
}

/** The drawer itself — rendered behind the page, revealed by the slide. */
export function MobileMenuPanel() {
  const { open, close } = useMobileMenu();
  return (
    <div
      id="mobile-menu"
      aria-hidden={!open}
      className={cn(
        'fixed inset-y-0 left-0 z-10 w-[300px] bg-band px-[30px] py-[22px] lg:hidden',
        'transition-opacity duration-300',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <BrandLogo className="h-[38px]" />

      <nav className="mt-[74px] flex flex-col gap-[50px]">
        {mobileMenu.groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-[15px]">
            <p className="tracked font-mono text-[13px] text-fg/[0.48]">{group.title}</p>
            <ul className="flex flex-col gap-1">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={close}
                    tabIndex={open ? undefined : -1}
                    className={cn(
                      'tracked block py-1 font-sans text-[16px] font-medium transition-opacity hover:opacity-70',
                      'accent' in link && link.accent ? 'text-accent-2' : 'text-fg'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

/**
 * Wraps the page content and performs the slide.
 *
 * Note the transform's side effect: while it is applied, this element becomes
 * the containing block for any `position: fixed` descendant, so the nav inside
 * stops resolving against the viewport. NavBar compensates by switching to
 * `absolute` at the captured scroll offset while the drawer is open.
 */
export function MobileMenuShell({ children }: { children: React.ReactNode }) {
  const { open, close } = useMobileMenu();
  return (
    <div
      className={cn(
        'relative z-20 min-h-dvh bg-page transition-[transform,border-radius] duration-300 ease-out',
        open && 'translate-x-[300px] overflow-hidden rounded-l-[41px] border-l-2 border-[#bebebe] dark:border-nav-border'
      )}
    >
      {children}
      {/* Click-away target, only while the drawer is out. */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className="absolute inset-0 z-50 cursor-pointer bg-transparent lg:hidden"
        />
      )}
    </div>
  );
}
